const readWorkInputGroups = (
  params: {
    work_uuid?: string,
  }) => {
  //#region 📌 실적-자재 투입내역 임시테이블 생성
  const createInputTempTable = `
    -- 📌 work_input 임시테이블 생성
    CREATE TEMP TABLE temp_work_input (
      prod_id int,
      qty numeric(19,6)
    );
    CREATE INDEX ON temp_work_input (prod_id);

    -- 📌 투입이력(실적기준) 저장
    INSERT INTO temp_work_input
    SELECT
      p_wi.prod_id,
      SUM(COALESCE(p_wi.qty, 0)) AS qty
    FROM prd_work_input_tb p_wi
    JOIN prd_work_tb p_w ON p_w.work_id = p_wi.work_id
    WHERE p_w.uuid = '${params.work_uuid}'
    GROUP BY p_wi.prod_id;
  `;
  //#endregion

  //#region 📌 실적 투입내역을 조회 할 메인 임시테이블 생성
  const createMainTempTable = `
    -- 📌 work_input_main 임시테이블 생성
    CREATE TEMP TABLE temp_work_input_main (
      factory_id int,
      prod_id int,
      qty numeric(19,6),
      c_usage numeric(19,6),
      unit_id int,
      from_store_id int,
      from_location_id int
    );
    CREATE INDEX ON temp_work_input_main (factory_id);
    CREATE INDEX ON temp_work_input_main (prod_id);
    CREATE INDEX ON temp_work_input_main (unit_id);
    CREATE INDEX ON temp_work_input_main (from_store_id);
    CREATE INDEX ON temp_work_input_main (from_location_id);

    -- 📌 메인 데이터 저장
    INSERT INTO temp_work_input_main
    SELECT
      p_oi.factory_id,
      p_oi.prod_id,
      COALESCE(t_wi.qty,0),
      p_oi.c_usage,
      p_oi.unit_id,
      p_oi.from_store_id, 
      p_oi.from_location_id
    FROM prd_order_input_tb p_oi
    LEFT JOIN temp_work_input t_wi ON t_wi.prod_id = p_oi.prod_id
    WHERE p_oi.order_id = orderId;

  `;
  //#endregion

  //#region 📌 추가 테이블 Join 및 조회 하는 임시테이블 생성
  const createReadTempTable = `
    CREATE TEMP TABLE temp_read_table(
      factory_uuid uuid,
      factory_cd varchar(20),
      factory_nm varchar(50),
      prod_uuid uuid,
      prod_no varchar(50),
      prod_nm varchar(100),
      item_type_uuid uuid,
      item_type_cd varchar(20),
      item_type_nm varchar(50),
      prod_type_uuid uuid,
      prod_type_cd varchar(20),
      prod_type_nm varchar(50),
      model_uuid uuid,
      model_cd varchar(20),
      model_nm varchar(50),
      rev varchar(10),
      prod_std varchar(250),
      unit_uuid uuid,
      unit_cd varchar(20),
      unit_nm varchar(50),
      qty numeric,
      c_usage numeric,
      required_order_qty numeric,
      required_work_qty numeric,
      from_store_uuid uuid,
      from_store_cd varchar(20),
      from_store_nm varchar(50),
      from_location_uuid uuid,
      from_location_cd varchar(20),
      from_location_nm varchar(50)
    );
    CREATE INDEX ON temp_read_table (prod_uuid);
    
    -- 📌 투입내역을 조회 할 메인 임시테이블에 JOIN하여 조회
    INSERT INTO temp_read_table
    SELECT
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      s_p.uuid as prod_uuid,
      s_p.prod_no,
      s_p.prod_nm,
      s_it.uuid as item_type_uuid,
      s_it.item_type_cd,
      s_it.item_type_nm,
      s_pt.uuid as prod_type_uuid,
      s_pt.prod_type_cd,
      s_pt.prod_type_nm,
      s_m.uuid as model_uuid,
      s_m.model_cd,
      s_m.model_nm,
      s_p.rev,
      s_p.prod_std,
      s_u.uuid as unit_uuid,
      s_u.unit_cd,
      s_u.unit_nm,
      t_wim.qty,
      t_wim.c_usage * COALESCE(s_uc.convert_value, 1) as c_usage,
      orderTotalQty * (t_wim.c_usage * COALESCE(s_uc.convert_value, 1)) as required_order_qty,
      workTotalQty * (t_wim.c_usage * COALESCE(s_uc.convert_value, 1)) as required_work_qty,
      s_s.uuid as from_store_uuid,
      s_s.store_cd as from_store_cd,
      s_s.store_nm as from_store_nm,
      s_l.uuid as from_location_uuid,
      s_l.location_cd as from_location_cd,
      s_l.location_nm as from_location_nm
    FROM temp_work_input_main t_wim
    JOIN std_factory_tb s_f ON s_f.factory_id = t_wim.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = t_wim.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = t_wim.unit_id
    LEFT JOIN std_store_tb s_s ON s_s.store_id = t_wim.from_store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = t_wim.from_location_id
    LEFT JOIN std_unit_convert_tb s_uc  ON s_uc.from_unit_id = t_wim.unit_id
                      AND s_uc.to_unit_id = s_u.unit_id;
  `
  //#endregion

  //#region 📌 추가 테이블 Join 및 조회
  const readInputs = `
    SELECT * FROM temp_read_table ORDER BY prod_uuid;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
    DROP TABLE temp_work_input_main;	
    DROP TABLE temp_work_input;	
    DROP TABLE temp_read_table;	
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 생산실적UUID로 작업지시ID 추출
    DO $$
    DECLARE orderId int;
    DECLARE orderTotalQty numeric(19,6);
    DECLARE workTotalQty numeric(19,6);

    BEGIN
    SELECT p_w.order_id, p_o.qty, p_w.qty + p_w.reject_qty 
    INTO orderId, orderTotalQty, workTotalQty
    FROM prd_work_tb p_w 
    JOIN prd_order_tb p_o ON p_o.order_id = p_w.order_id
    WHERE p_w.uuid = '${params.work_uuid}';

    -- 생산실적 기준 실적-자재투입 정보를 가지고 있는 임시테이블 생성
    ${createInputTempTable}

    -- 지시-자재투입 데이터에 실적-자재투입 임시테이블 데이터를 LEFT JOIN 해서 생산실적에 투입된 자재가 없는 경우에도 
    -- Read 될 수 있도록 새로운 임시테이블 Setting
    ${createMainTempTable}

    -- 투입내역을 조회 할 메인 임시테이블에 JOIN하여 조회 할 임시테이블 생성
    ${createReadTempTable}

    END $$;

    -- 투입내역 조회
    ${readInputs}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readWorkInputGroups }