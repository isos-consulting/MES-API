const readReturnReport = (
  params: {
    sort_type?: 'store' | 'prod' | 'date',
    start_date?: string,
    end_date?: string,
    factory_uuid?: string,
  }
) => {
  let searchQuery: string = '';

  const createReturnTempTable = `
    CREATE TEMP TABLE temp_return(
      return_id int, 
      factory_id int, 
      reg_date timestamptz, 
      prod_id int, 
      lot_no varchar(25), 
      qty numeric,
      from_store_id int, 
      from_location_id int, 
      to_store_id int, 
      to_location_id int, 
      remark varchar(250),
      created_at timestamptz, created_uid int, created_nm varchar(20), 
      updated_at timestamptz, updated_uid int, updated_nm varchar(20)
    );
  `;

  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.start_date && params.end_date) { searchQuery += ` AND p_r.reg_date BETWEEN '${params.start_date}' AND '${params.end_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const insertDataToTempTable = `
    INSERT INTO temp_return
    SELECT 
      p_r.return_id, 
      p_r.factory_id, 
      p_r.reg_date, 
      p_r.prod_id, 
      p_r.lot_no, 
      p_r.qty, 
      p_r.from_store_id, 
      p_r.from_location_id, 
      p_r.to_store_id, 
      p_r.to_location_id, 
      p_r.remark,
      p_r.created_at, p_r.created_uid, a_uc.user_nm,
      p_r.updated_at, p_r.updated_uid, a_uu.user_nm
    FROM prd_return_tb p_r
    JOIN std_factory_tb s_f ON s_f.factory_id = p_r.factory_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_r.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_r.updated_uid
    ${searchQuery};
  `;

  let reportOrderBy: string;
  switch (params.sort_type) {
    case 'store': reportOrderBy = `ORDER BY t_r.from_store_id`; break;
    case 'prod': reportOrderBy = `ORDER BY t_r.prod_id`; break;
    case 'date': reportOrderBy = `ORDER BY t_r.reg_date`; break;
    default: reportOrderBy = ''; break;
  }

  const readReport = `
    SELECT
      p_r.uuid as return_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      t_r.reg_date,
      s_p.uuid as prod_uuid,
      s_p.prod_no,
      s_p.prod_nm,
      p_rt.uuid as item_type_uuid,
      p_rt.item_type_cd,
      p_rt.item_type_nm,
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
      t_r.lot_no,
      COALESCE(t_r.qty,0) as qty,
      f_ss.uuid as from_store_uuid,
      f_ss.store_cd as from_store_cd,
      f_ss.store_nm as from_store_nm,
      t_sl.uuid as from_location_uuid,
      f_sl.location_cd as from_location_cd,
      f_sl.location_nm as from_location_nm,
      t_ss.uuid as to_store_uuid,
      t_ss.store_cd as to_store_cd,
      t_ss.store_nm as to_store_nm,
      t_sl.uuid as to_location_uuid,
      t_sl.location_cd as to_location_cd,
      t_sl.location_nm as to_location_nm,
      t_r.remark,
      t_r.created_at,
      t_r.created_uid,
      t_r.created_nm,
      t_r.updated_at,
      t_r.updated_uid,
      t_r.updated_nm
    FROM temp_return t_r
    LEFT JOIN prd_return_tb p_r ON p_r.return_id = t_r.return_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_r.factory_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_r.prod_id
    LEFT JOIN std_item_type_tb p_rt ON p_rt.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_store_tb f_ss ON f_ss.store_id = t_r.from_store_id
    LEFT JOIN std_location_tb f_sl ON f_sl.location_id = t_r.from_location_id
    LEFT JOIN std_store_tb t_ss ON t_ss.store_id = t_r.to_store_id
    LEFT JOIN std_location_tb t_sl ON t_sl.location_id = t_r.to_location_id
    ${reportOrderBy};
  `;

  const dropTempTable = `
    DROP TABLE temp_return;
  `;

  const query = `
    -- 📌 자재반납현황을 조회하기 위하여 임시테이블 생성
    ${createReturnTempTable}

    -- 📌 임시테이블에 자재반납현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 자재반납현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readReturnReport }