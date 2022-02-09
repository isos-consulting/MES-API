import TTenantOpt, { PRD_METHOD_REJECT_QTY } from "../../types/tenant-opt.type";

const readWorkInputGroup = (
  params: {
    work_uuid?: string,
    opt_reject_qty?: TTenantOpt
  }) => {
  //#region 📌 실적-자재 투입내역 임시테이블 생성
  const createInputTempTable = `
    -- 📌 마지막공정의 양품, 불량수량 가져 올 임시테이블 생성
    CREATE TEMP TABLE temp_final_routing (work_id int, work_routing_id int, qty NUMERIC, reject_qty NUMERIC);
    CREATE INDEX ON temp_final_routing(work_id);
    WITH complete AS
    (
      SELECT 
        p_wr.work_id, p_wr.work_routing_id, coalesce(p_wr.qty,0) as qty, COALESCE(p_wrt.qty, 0) AS reject_qty,
        rank() over(PARTITION BY p_wr.work_id ORDER BY p_wr.proc_no DESC) AS rn
      FROM prd_work_routing_tb p_wr
      LEFT JOIN prd_work_reject_tb p_wrt ON p_wrt.work_routing_id = p_wr.work_routing_id
      WHERE p_wr.work_id = workId
    )
    INSERT INTO temp_final_routing
    SELECT work_id, work_routing_id, qty, reject_qty FROM complete WHERE rn = 1;
      
    -- 📌 전체공정순서의 불량수량 합계를 가져 올 임시테이블 생성
    CREATE TEMP TABLE temp_reject_sum(work_id int, reject_qty numeric);
    CREATE INDEX ON temp_reject_sum(work_id);
    INSERT INTO temp_reject_sum
    SELECT work_routing_id, sum(qty) AS qty
    FROM prd_work_reject_tb
    WHERE work_id = workId
    GROUP BY work_routing_id;

    -- 📌 work_input 임시테이블 생성
    CREATE TEMP TABLE temp_work_input (
      factory_id int,
      work_id int,
      prod_id int,
      qty numeric(19,6),
      c_usage numeric(19,6),
      unit_id int,
      from_store_id int,
      from_location_id int,
      bom_input_type_id int,
      remark varchar(250)
    );
    CREATE INDEX ON temp_work_input (prod_id);

    -- 📌 투입이력(실적기준) 저장
    INSERT INTO temp_work_input
    SELECT
      p_wi.factory_id,
      p_wi.work_id,
      p_wi.prod_id,
      sum(coalesce(p_wi.qty,0)),
      p_wi.c_usage,
      p_wi.unit_id,
      p_wi.from_store_id,
      p_wi.from_location_id,
      p_wi.bom_input_type_id,
      p_wi.remark
    FROM prd_work_input_tb p_wi
    WHERE p_wi.work_id = workId
    GROUP BY p_wi.factory_id, p_wi.work_id, p_wi.prod_id, p_wi.c_usage, p_wi.unit_id, p_wi.from_store_id, p_wi.from_location_id, p_wi.bom_input_type_id, p_wi.remark;
  `;
  //#endregion

  //#region 📌 실적 투입내역을 조회 할 메인 임시테이블 생성
  const createMainTempTable = `
    -- 📌 work_input_main 임시테이블 생성
    CREATE TEMP TABLE temp_work_input_main (
      factory_id int,
      work_id int,
      prod_id int,
      qty numeric(19,6),
      c_usage numeric(19,6),
      unit_id int,
      from_store_id int,
      from_location_id int,
      bom_input_type_id int,
      remark varchar(250)
    );
    CREATE INDEX ON temp_work_input_main (factory_id);
    CREATE INDEX ON temp_work_input_main (work_id);
    CREATE INDEX ON temp_work_input_main (prod_id);
    CREATE INDEX ON temp_work_input_main (unit_id);
    CREATE INDEX ON temp_work_input_main (from_store_id);
    CREATE INDEX ON temp_work_input_main (from_location_id);
    CREATE INDEX ON temp_work_input_main (bom_input_type_id);

    -- 📌 메인 데이터 저장
    INSERT INTO temp_work_input_main
    SELECT 
      p_oi.factory_id, 
      t_wi.work_id, 
      p_oi.prod_id,
      t_wi.qty, 
      p_oi.c_usage,
      p_oi.unit_id, 
      COALESCE(t_wi.from_store_id, p_oi.from_store_id), 
      COALESCE(t_wi.from_location_id, p_oi.from_location_id),
      COALESCE(t_wi.bom_input_type_id, p_oi.bom_input_type_id),
      COALESCE(t_wi.remark,'')
    FROM prd_order_input_tb p_oi 
    LEFT JOIN temp_work_input t_wi 	ON t_wi.prod_id = p_oi.prod_id
    WHERE p_oi.order_id = orderId;
  `;
  //#endregion

  //#region 📌 추가 테이블 Join 및 조회
  // 📌 투입내역을 조회 할 메인 임시테이블에 JOIN하여 조회
  const readInputs = `
    SELECT
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      p_w.uuid as work_uuid,
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
      (COALESCE(t_fr.qty, 0) + (CASE WHEN ${params.opt_reject_qty} = ${PRD_METHOD_REJECT_QTY.SUM} THEN COALESCE(t_rs.reject_qty, 0) ELSE COALESCE(t_fr.reject_qty, 0) END)) * (t_wim.c_usage * COALESCE(s_uc.convert_value, 1)) as required_work_qty,
      s_s.uuid as from_store_uuid,
      s_s.store_cd as from_store_cd,
      s_s.store_nm as from_store_nm,
      s_l.uuid as from_location_uuid,
      s_l.location_cd as from_location_cd,
      s_l.location_nm as from_location_nm,
      a_bit.uuid as bom_input_type_uuid,
      a_bit.bom_input_type_cd as bom_input_type_cd,
      a_bit.bom_input_type_nm as bom_input_type_nm,
      t_wim.remark
    FROM temp_work_input_main t_wim
    LEFT JOIN prd_work_tb p_w ON p_w.work_id = t_wim.work_id
    LEFT JOIN prd_order_tb p_o ON p_o.order_id = p_w.order_id
    LEFT JOIN temp_final_routing t_fr ON t_fr.work_id = p_w.work_id
    LEFT JOIN temp_reject_sum t_rs ON t_rs.work_id = p_w.work_id
    JOIN std_factory_tb s_f ON s_f.factory_id = t_wim.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = t_wim.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = t_wim.unit_id 
    LEFT JOIN std_store_tb s_s ON s_s.store_id = t_wim.from_store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = t_wim.from_location_id
    JOIN adm_bom_input_type_tb a_bit ON a_bit.bom_input_type_id = t_wim.bom_input_type_id
    LEFT JOIN std_unit_convert_tb s_uc 	ON s_uc.from_unit_id = t_wim.unit_id
                      AND s_uc.to_unit_id = s_u.unit_id 
    ORDER BY t_wim.prod_id;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
    DROP TABLE temp_final_routing;	
    DROP TABLE temp_reject_sum;
    DROP TABLE temp_work_input_main;	
    DROP TABLE temp_work_input;	
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 생산실적UUID로 작업지시ID 추출
    DO $$
    DECLARE orderId int;
    DECLARE workId int;

    BEGIN
    SELECT p_w.order_id INTO orderId FROM prd_work_tb p_w WHERE p_w.uuid = '${params.work_uuid}';
    SELECT p_w.work_id INTO workId FROM prd_work_tb p_w WHERE p_w.uuid = '${params.work_uuid}';

    -- 생산실적 기준 실적-자재투입 정보를 가지고 있는 임시테이블 생성
    ${createInputTempTable}

    -- 지시-자재투입 데이터에 실적-자재투입 임시테이블 데이터를 LEFT JOIN 해서 생산실적에 투입된 자재가 없는 경우에도 
    -- Read 될 수 있도록 새로운 임시테이블 Setting
    ${createMainTempTable}

    END $$;

    -- 투입내역을 조회 할 메인 임시테이블에 JOIN하여 조회
    ${readInputs}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readWorkInputGroup }