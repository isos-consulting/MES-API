const readStoreIndividualHistory = (
  params: {
    start_date: string,
    end_date: string,
    factory_uuid: string,
    store_uuid: string,
  }) => {
  //#region 📌 임시테이블 생성
  const createTempTable = `
    CREATE TEMP TABLE temp_store(
      reg_date timestamptz,
      factory_id int,
      prod_id int,
      reject_id int,
      lot_no varchar(25),
      store_id int,
      location_id int,
      tran_type_id int,
      inout_val int,
      basic_stock numeric(19,6),
      in_qty numeric(19,6),
      out_qty numeric(19,6),
      update_qty numeric(19,6),
      created_at timestamptz,
      created_uid int,
      updated_at timestamptz,
      updated_uid int
    );
    CREATE INDEX ON temp_store(factory_id);
    CREATE INDEX ON temp_store(prod_id);
    CREATE INDEX ON temp_store(reject_id);
    CREATE INDEX ON temp_store(store_id);
    CREATE INDEX ON temp_store(location_id);
  `;
  //#endregion

  //#region 📌 임시테이블 데이터 삽입
  const insertToTempTable = `
    INSERT INTO temp_store
    SELECT 	
      i_s.reg_date,
      i_s.factory_id,
      i_s.prod_id,
      i_s.reject_id,
      i_s.lot_no,
      i_s.store_id,
      i_s.location_id,
      i_s.tran_type_id,
      CASE WHEN i_s.inout_fg = TRUE THEN 1 ELSE 0 END,
      COALESCE(b_s.qty,0),
      CASE WHEN a_tt.tran_type_cd = 'INVENTORY' THEN 0 ELSE CASE WHEN i_s.inout_fg = TRUE THEN i_s.qty ELSE 0 END END,
      CASE WHEN a_tt.tran_type_cd = 'INVENTORY' THEN 0 ELSE CASE WHEN i_s.inout_fg = TRUE THEN 0 ELSE i_s.qty END END,
      CASE WHEN a_tt.tran_type_cd <> 'INVENTORY' THEN 0 ELSE CASE WHEN i_s.inout_fg = TRUE THEN i_s.qty ELSE (i_s.qty * -1) END END,
      i_s.created_at,
      i_s.created_uid,
      i_s.updated_at,
      i_s.updated_uid
    FROM inv_store_tb i_s
    JOIN std_factory_tb s_f ON s_f.factory_id = i_s.factory_id
    JOIN std_store_tb s_s ON s_s.store_id = i_s.store_id
    JOIN adm_tran_type_tb a_tt ON a_tt.tran_type_id = i_s.tran_type_id
    LEFT JOIN (	
      SELECT 	
        i_s.factory_id, i_s.prod_id, i_s.reject_id, i_s.lot_no, i_s.store_id, i_s.location_id,
        sum(CASE WHEN i_s.inout_fg = FALSE THEN COALESCE(i_s.qty,0) * -1 ELSE COALESCE(i_s.qty,0) END) AS qty
      FROM inv_store_tb i_s
      WHERE date(i_s.reg_date) <= '${params.start_date}'
      GROUP BY i_s.factory_id, i_s.prod_id, i_s.reject_id, i_s.lot_no, i_s.store_id, i_s.location_id
    ) b_s ON b_s.factory_id = i_s.factory_id 
          AND b_s.store_id = i_s.store_id
          AND b_s.prod_id = i_s.prod_id
          AND b_s.lot_no = i_s.lot_no
          AND COALESCE(b_s.reject_id,0) = COALESCE(i_s.reject_id,0)
          AND COALESCE(b_s.location_id,0) = COALESCE(i_s.location_id,0)
    WHERE date(i_s.reg_date) BETWEEN '${params.start_date}' AND '${params.end_date}'
    AND s_f.uuid = '${params.factory_uuid}'
    AND s_s.uuid = '${params.store_uuid}';
  `;
  //#endregion

  //#region 📌 추가 테이블 Join 및 조회
  // 📌 Filtering 되어있는 재고 정보에 추가 테이블 Join 하여 조회
  const readHistory = `
    SELECT 
      t_s.reg_date,
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
      s_r.uuid as reject_uuid,
      s_r.reject_cd,
      s_r.reject_nm,
      t_s.lot_no,
      s_s.uuid as store_uuid,
      s_s.store_cd,
      s_s.store_nm,
      s_l.uuid as location_uuid,
      s_l.location_cd,
      s_l.location_nm,
      a_tt.uuid as tran_type_uuid,
      a_tt.tran_type_cd,
      a_tt.tran_type_nm,
      t_s.basic_stock,
      t_s.in_qty,
      t_s.out_qty,
      t_s.update_qty,
      COALESCE(t_s.basic_stock,0) + (sum(t_s.in_qty - t_s.out_qty + t_s.update_qty) OVER (PARTITION BY t_s.prod_id, t_s.lot_no ORDER BY t_s.reg_date, t_s.created_at, t_s.inout_val)) as final_stock,
      t_s.created_at,
      t_s.created_uid,
      a_uc.user_nm as created_nm,
      t_s.updated_at,
      t_s.updated_uid,
      a_uu.user_nm as updated_nm
    FROM temp_store t_s
    JOIN std_factory_tb s_f ON s_f.factory_id = t_s.factory_id
    JOIN adm_tran_type_tb a_tt ON a_tt.tran_type_id = t_s.tran_type_id
    JOIN std_prod_tb s_p ON s_p.prod_id = t_s.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_store_tb s_s ON s_s.store_id = t_s.store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = t_s.location_id
    LEFT JOIN std_reject_tb s_r ON s_r.reject_id = t_s.reject_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = t_s.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = t_s.updated_uid
    ORDER BY t_s.prod_id, t_s.lot_no, t_s.reg_date, t_s.created_at, t_s.inout_val;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
    DROP TABLE temp_store;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 임시테이블 생성
    ${createTempTable}

    -- 수불 데이터 임시테이블로 삽입
    ${insertToTempTable}

    -- Filtering 되어있는 수불 정보에 추가 테이블 Join 하여 조회
    ${readHistory}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readStoreIndividualHistory }