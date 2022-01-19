const readStoreHistoryByTransaction = (
  params: {
    start_date: string,
    end_date: string,
    tran_type_cd: string,
    factory_uuid?: string,
    store_uuid?: string,
    location_uuid?: string
  }) => {
  let searchQuery: string = '';

  //#region 📌 수불이력 저장 임시테이블 생성
  const createHistoryTempTable = `
    CREATE TEMP TABLE temp_tran_history(
      tran_id int, 
      tran_uuid uuid,
      inout_state TEXT, 
      tran_cd varchar(20), 
      reg_date timestamp, 
      factory_id int,
      store_id int, 
      location_id int, 
      prod_id int, 
      reject_id int, 
      lot_no varchar(25), 
      qty NUMERIC(19,6), 
      remark varchar(250), 
      created_at timestamptz, 
      created_uid int, 
      updated_at timestamptz, 
      updated_uid int
    );
    CREATE INDEX ON temp_tran_history(tran_id);
    CREATE INDEX ON temp_tran_history(tran_uuid);
    CREATE INDEX ON temp_tran_history(factory_id, store_id, location_id, prod_id, reject_id, lot_no);
  `;
  //#endregion

  //#region 📌 수불이력 등록 당시 재고를 저장하기 위한 임시테이블 생성
  const createStockTempTable = `
    CREATE TEMP TABLE temp_stock(
      tran_id int,
      factory_id int,
      store_id int, 
      location_id int, 
      prod_id int, 
      reject_id int, 
      lot_no varchar(25), 
      qty NUMERIC(19,6)
    );
    CREATE INDEX ON temp_stock(tran_id);
    CREATE INDEX ON temp_stock(factory_id, store_id, location_id, prod_id, reject_id, lot_no);
  `;
  //#endregion

  //#region 📌 수불이력 데이터 삽입
  searchQuery = `WHERE i_s.tran_cd = '${params.tran_type_cd}'`;
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.store_uuid) { searchQuery += ` AND s_s.uuid = '${params.store_uuid}'`; }
  if (params.location_uuid) { searchQuery += ` AND s_l.uuid = '${params.location_uuid}'`; }

  const insertToHistoryTempTable = `
    INSERT INTO temp_tran_history
    SELECT
      i_s.tran_id,
      i_s.uuid,
      CASE WHEN i_s.inout_fg = TRUE THEN '입고' ELSE '출고' END,
      i_s.tran_cd,
      i_s.reg_date,
      i_s.factory_id,
      i_s.store_id,
      i_s.location_id,
      i_s.prod_id,
      i_s.reject_id,
      i_s.lot_no,
      i_s.qty,
      i_s.remark,
      i_s.created_at,
      i_s.created_uid,
      i_s.updated_at,
      i_s.updated_uid
    FROM inv_store_tb i_s 
    JOIN std_factory_tb s_f ON s_f.factory_id = i_s.factory_id 
    JOIN std_store_tb s_s ON s_s.store_id = i_s.store_id 
    LEFT JOIN std_location_tb s_l ON s_l.location_id = i_s.location_id 
    ${searchQuery};
  `;
  //#endregion

  //#region 📌 재고 데이터 삽입
  const insertToStockTempTable = `
    INSERT INTO temp_stock
    SELECT 
      t_th.tran_id,
      i_s.factory_id,
      i_s.store_id, 
      i_s.location_id, 
      i_s.prod_id, 
      i_s.reject_id, 
      i_s.lot_no, 
      CASE WHEN i_s.inout_fg = FALSE THEN COALESCE(i_s.qty,0) * -1 ELSE COALESCE(i_s.qty,0) END
    FROM inv_store_tb i_s 
    LEFT JOIN temp_tran_history t_th ON t_th.factory_id = i_s.factory_id 
                    AND t_th.store_id = i_s.store_id 
                    AND t_th.prod_id = i_s.prod_id 
                    AND t_th.lot_no = i_s.lot_no
                    AND COALESCE(t_th.reject_id,0) = COALESCE(i_s.reject_id,0)
                    AND COALESCE(t_th.location_id,0) = COALESCE(i_s.location_id,0)
                    AND t_th.reg_date >= i_s.reg_date 
                    AND CASE WHEN t_th.reg_date > i_s.reg_date THEN CAST('9999-12-31 23:59:59' AS timestamptz) ELSE t_th.created_at END >= i_s.created_at ;
  `;
  //#endregion

  //#region 📌 추가 테이블 Join 및 조회
  // 📌 Filtering 되어있는 재고 정보에 추가 테이블 Join 하여 조회
  const readStockQuery = `
    SELECT 
      t_th.tran_uuid,
      t_th.inout_state,
      t_th.tran_cd,
      a_t.tran_nm,
      t_th.reg_date,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      s_s.uuid as store_uuid,
      s_s.store_cd,
      s_s.store_nm,
      s_l.uuid as location_uuid,
      s_l.location_cd,
      s_l.location_nm,
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
      s_r.uuid as reject_uuid,
      s_r.reject_cd,
      s_r.reject_nm,
      t_th.lot_no,
      t_th.qty,
      COALESCE(t_s.stock,0) as stock,
      t_th.remark,
      t_th.created_at,
      t_th.created_uid,
      a_uc.user_nm as created_nm,
      t_th.updated_at,
      t_th.updated_uid,
      a_uu.user_nm as updated_nm
    FROM temp_tran_history t_th
    JOIN adm_transaction_vw a_t ON a_t.tran_cd = t_th.tran_cd 
    JOIN std_factory_tb s_f ON s_f.factory_id = t_th.factory_id 
    JOIN std_store_tb s_s ON s_s.store_id = t_th.store_id 
    LEFT JOIN std_location_tb s_l ON s_l.location_id = t_th.location_id 
    JOIN std_prod_tb s_p ON s_p.prod_id = t_th.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_reject_tb s_r ON s_r.reject_id = t_th.reject_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = t_th.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = t_th.updated_uid
    LEFT JOIN (	SELECT t_s.tran_id, sum(COALESCE(t_s.qty,0)) AS stock
          FROM temp_stock t_s
          GROUP BY t_s.tran_id) t_s ON t_s.tran_id = t_th.tran_id
    ORDER BY t_th.factory_id, t_th.reg_date, t_th.prod_id, t_th.created_at;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
    DROP TABLE temp_tran_history;
    DROP TABLE temp_stock;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 수불이력 저장 임시테이블 생성 및 데이터 삽입
    ${createHistoryTempTable}
    ${insertToHistoryTempTable}

    -- 수불이력 당시 재고 수량 관련 임시테이블 생성 및 데이터 삽입
    ${createStockTempTable}
    ${insertToStockTempTable}

    -- Filtering 되어있는 재고 정보에 추가 테이블 Join 하여 조회
    ${readStockQuery}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readStoreHistoryByTransaction }