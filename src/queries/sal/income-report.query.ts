const readIncomeReport = (
  params: {
    sort_type?: 'store' | 'prod' | 'date',
    start_date?: string,
    end_date?: string,
    factory_uuid?: string,
  }
) => {
  let searchQuery: string = '';
  
  const createIncomeTempTable = `
    CREATE TEMP TABLE temp_income(
      income_id int, 
      factory_id int, 
      reg_date timestamp, 
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
  if (params.start_date && params.end_date) { searchQuery += ` AND date(s_i.reg_date) BETWEEN '${params.start_date}' AND '${params.end_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const insertDataToTempTable = `
    INSERT INTO temp_income
    SELECT 
      s_i.income_id, 
      s_i.factory_id, 
      s_i.reg_date, 
      s_i.prod_id, 
      s_i.lot_no, 
      s_i.qty, 
      s_i.from_store_id, 
      s_i.from_location_id, 
      s_i.to_store_id, 
      s_i.to_location_id, 
      s_i.remark,
      s_i.created_at, s_i.created_uid, a_uc.user_nm,
      s_i.updated_at, s_i.updated_uid, a_uu.user_nm
    FROM sal_income_tb s_i
    JOIN std_factory_tb s_f ON s_f.factory_id = s_i.factory_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = s_i.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = s_i.updated_uid
    ${searchQuery};
  `;

  let reportOrderBy: string;
  switch (params.sort_type) {
    case 'store': reportOrderBy = `ORDER BY t_i.from_store_id`; break;
    case 'prod': reportOrderBy = `ORDER BY t_i.prod_id`; break;
    case 'date': reportOrderBy = `ORDER BY t_i.reg_date`; break;
    default: reportOrderBy = ''; break;
  }

  const readReport = `
    SELECT
      s_i.uuid as income_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      t_i.reg_date,
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
      t_i.lot_no,
      COALESCE(t_i.qty,0) as qty,
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
      t_i.remark,
      t_i.created_at,
      t_i.created_uid,
      t_i.created_nm,
      t_i.updated_at,
      t_i.updated_uid,
      t_i.updated_nm
    FROM temp_income t_i
    LEFT JOIN sal_income_tb s_i ON s_i.income_id = t_i.income_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_i.factory_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_i.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_store_tb f_ss ON f_ss.store_id = t_i.from_store_id
    LEFT JOIN std_location_tb f_sl ON f_sl.location_id = t_i.from_location_id
    LEFT JOIN std_store_tb t_ss ON t_ss.store_id = t_i.to_store_id
    LEFT JOIN std_location_tb t_sl ON t_sl.location_id = t_i.to_location_id
    ${reportOrderBy};
  `;

  const dropTempTable = `
    DROP TABLE temp_income;
  `;

  const query = `
    -- 📌 제품입고현황을 조회하기 위하여 임시테이블 생성
    ${createIncomeTempTable}

    -- 📌 임시테이블에 제품입고현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 제품입고현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readIncomeReport }