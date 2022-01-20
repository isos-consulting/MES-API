const readReturnReport = (
  params: {
    sort_type?: 'partner' | 'prod' | 'date' ,
    start_date?: string,
    end_date?: string,
    factory_uuid?: string,
  }
) => {
  let searchQuery: string = '';
  
  const createReturnTempTable = `
    CREATE TEMP TABLE temp_return(
      return_detail_id int, 
      factory_id int, 
      reg_date timestamp, 
      partner_id int, 
      prod_id int, 
      lot_no varchar(25), 
      qty numeric, 
      price numeric,
      money_unit_id int, 
      exchange numeric, 
      supply_price numeric, 
      tax numeric, 
      total_price numeric, 
      receive_qty numeric, 
      remark varchar(250),
      created_at timestamptz, created_uid int, created_nm varchar(20), 
      updated_at timestamptz, updated_uid int, updated_nm varchar(20)
    );
  `;

  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.start_date && params.end_date) { searchQuery += ` AND date(m_r.reg_date) BETWEEN '${params.start_date}' AND '${params.end_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const insertDataToTempTable = `
    INSERT INTO temp_return
    SELECT 
      m_rd.return_detail_id, 
      m_rd.factory_id, 
      m_r.reg_date, 
      m_r.partner_id, 
      m_rd.prod_id, 
      m_rd.lot_no, 
      m_rd.qty, 
      m_rd.price, 
      m_rd.money_unit_id, 
      m_rd.exchange, 
      m_rd.total_price, 
      (m_rd.total_price * 0.1), 
      m_rd.total_price + (m_rd.total_price * 0.1), 
      COALESCE(m_rcd.qty,0), 
      m_rd.remark,
      m_rd.created_at, m_rd.created_uid, a_uc.user_nm,
      m_rd.updated_at, m_rd.updated_uid, a_uu.user_nm
    FROM mat_return_detail_tb m_rd
    JOIN std_factory_tb s_f ON s_f.factory_id = m_rd.factory_id
    JOIN mat_return_tb m_r ON m_r.return_id = m_rd.return_id
    LEFT JOIN mat_receive_detail_tb m_rcd ON m_rcd.receive_detail_id = m_rd.receive_detail_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = m_rd.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = m_rd.updated_uid
    ${searchQuery};
  `;

  let reportOrderBy: string;
  switch (params.sort_type) {
    case 'partner': reportOrderBy = `ORDER BY t_r.partner_id`; break;
    case 'prod': reportOrderBy = `ORDER BY t_r.prod_id`; break;
    case 'date': reportOrderBy = `ORDER BY t_r.reg_date`; break;
    default: reportOrderBy = ''; break;
  }

  const readReport = `
    SELECT
      m_rd.uuid as return_detail_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      t_r.reg_date,
      s_pn.uuid as partner_uuid,
      s_pn.partner_cd,
      s_pn.partner_nm,
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
      t_r.lot_no,
      COALESCE(t_r.qty,0) as qty,
      m_rd.convert_value,
      t_r.price,
      s_mu.uuid as money_unit_uuid,
      s_mu.money_unit_cd,
      s_mu.money_unit_nm,
      t_r.exchange,
      COALESCE(t_r.supply_price,0) as supply_price,
      COALESCE(t_r.tax,0) as tax,
      COALESCE(t_r.total_price,0) as total_price,
      COALESCE(t_r.receive_qty,0) as receive_qty,
      t_r.remark,
      t_r.created_at,
      t_r.created_uid,
      t_r.created_nm,
      t_r.updated_at,
      t_r.updated_uid,
      t_r.updated_nm
    FROM temp_return t_r
    LEFT JOIN mat_return_detail_tb m_rd ON m_rd.return_detail_id = t_r.return_detail_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_r.factory_id
    LEFT JOIN std_partner_tb s_pn ON s_pn.partner_id = t_r.partner_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_r.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = m_rd.unit_id
    LEFT JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = t_r.money_unit_id
    ${reportOrderBy};
  `;

  const dropTempTable = `
    DROP TABLE temp_return;
  `;

  const query = `
    -- 📌 반출현황을 조회하기 위하여 임시테이블 생성
    ${createReturnTempTable}

    -- 📌 임시테이블에 반출현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 반출현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readReturnReport }