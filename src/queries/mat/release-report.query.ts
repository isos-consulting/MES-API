const readReleaseReport = (
  params: {
    sort_type?: 'store' | 'prod' | 'date',
    start_date?: string,
    end_date?: string,
    factory_uuid?: string,
  }
) => {
  let searchQuery: string = '';
  
  const createReleaseTempTable = `
    CREATE TEMP TABLE temp_release(
      release_id int, 
      factory_id int, 
      reg_date timestamptz, 
      prod_id int, 
      demand_qty numeric, 
      lot_no varchar(25), 
      qty numeric,
      from_store_id int, 
      from_location_id int, 
      to_store_id int, 
      to_location_id int, 
      proc_id int, 
      equip_id int, 
      dept_id int, 
      remark varchar(250),
      created_at timestamptz, created_uid int, created_nm varchar(20), 
      updated_at timestamptz, updated_uid int, updated_nm varchar(20)
    );
  `;

  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.start_date && params.end_date) { searchQuery += ` AND m_r.reg_date BETWEEN '${params.start_date}' AND '${params.end_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const insertDataToTempTable = `
    INSERT INTO temp_release
    SELECT 
      m_r.release_id, 
      m_r.factory_id, 
      m_r.reg_date, 
      m_r.prod_id, 
      p_d.qty, 
      m_r.lot_no, 
      m_r.qty, 
      m_r.from_store_id, 
      m_r.from_location_id, 
      m_r.to_store_id, 
      m_r.to_location_id, 
      p_d.proc_id, 
      p_d.equip_id, 
      p_d.dept_id, 
      m_r.remark,
      m_r.created_at, m_r.created_uid, a_uc.user_nm,
      m_r.updated_at, m_r.updated_uid, a_uu.user_nm
    FROM mat_release_tb m_r
    JOIN std_factory_tb s_f ON s_f.factory_id = m_r.factory_id
    LEFT JOIN prd_demand_tb p_d ON p_d.demand_id = m_r.demand_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = m_r.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = m_r.updated_uid
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
      m_r.uuid as release_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      t_r.reg_date,
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
      COALESCE(t_r.demand_qty,0) as demand_qty,
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
      s_pc.uuid as proc_uuid,
      s_pc.proc_cd,
      s_pc.proc_nm,
      s_e.uuid as equip_uuid,
      s_e.equip_cd,
      s_e.equip_nm,
      s_d.uuid as dept_uuid,
      s_d.dept_cd,
      s_d.dept_nm,
      t_r.remark,
      t_r.created_at,
      t_r.created_uid,
      t_r.created_nm,
      t_r.updated_at,
      t_r.updated_uid,
      t_r.updated_nm
    FROM temp_release t_r
    LEFT JOIN mat_release_tb m_r ON m_r.release_id = t_r.release_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_r.factory_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_r.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_store_tb f_ss ON f_ss.store_id = t_r.from_store_id
    LEFT JOIN std_location_tb f_sl ON f_sl.location_id = t_r.from_location_id
    LEFT JOIN std_store_tb t_ss ON t_ss.store_id = t_r.to_store_id
    LEFT JOIN std_location_tb t_sl ON t_sl.location_id = t_r.to_location_id
    LEFT JOIN std_proc_tb s_pc ON s_pc.proc_id = t_r.proc_id
    LEFT JOIN std_equip_tb s_e ON s_e.equip_id = t_r.equip_id
    LEFT JOIN std_dept_tb s_d ON s_d.dept_id = t_r.dept_id
    ${reportOrderBy};
  `;

  const dropTempTable = `
    DROP TABLE temp_release;
  `;

  const query = `
    -- 📌 공정출고현황을 조회하기 위하여 임시테이블 생성
    ${createReleaseTempTable}

    -- 📌 임시테이블에 공정출고현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 공정출고현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readReleaseReport }