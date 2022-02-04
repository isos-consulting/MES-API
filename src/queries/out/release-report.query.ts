

const readReleaseReport = (
  params: {
    sort_type?: 'partner' | 'prod' | 'date',
    start_reg_date?: string,
    end_reg_date?: string,
    start_due_date?: string,
    end_due_date?: string,
    factory_uuid?: string,
  }
) => {

  let searchQuery: string = '';

  const createReleaseTempTable = `
    CREATE TEMP TABLE temp_release(
      release_detail_id int, 
      factory_id int, 
      reg_date timestamp, 
      partner_id int, 
      prod_id int, 
      order_qty numeric, 
      lot_no varchar(25), 
      qty numeric, 
      price numeric,
      money_unit_id int, 
      exchange numeric, 
      supply_price numeric, 
      tax numeric, 
      total_price numeric, 
      from_store_id int, 
      from_location_id int, 
      remark varchar(250),
      created_at timestamptz, created_uid int, created_nm varchar(20), 
      updated_at timestamptz, updated_uid int, updated_nm varchar(20)
    );
  `;

  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.start_reg_date && params.end_reg_date) { searchQuery += ` AND date(o_r.reg_date) BETWEEN '${params.start_reg_date}' AND '${params.end_reg_date}'`; }
  if (params.start_due_date && params.end_due_date) { searchQuery += ` AND date(m_od.due_date) BETWEEN '${params.start_due_date}' AND '${params.end_due_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const insertDataToTempTable = `
    INSERT INTO temp_release
    SELECT 
      o_rd.release_detail_id, 
      o_rd.factory_id, 
      o_r.reg_date, 
      o_r.partner_id, 
      o_rd.prod_id, 
      COALESCE(m_od.qty,0),
      o_rd.lot_no, 
      o_rd.qty, 
      o_rd.price, 
      o_rd.money_unit_id, 
      o_rd.exchange, 
      o_rd.total_price, 
      (o_rd.total_price * 0.1), 
      o_rd.total_price + (o_rd.total_price * 0.1), 
      o_rd.from_store_id, 
      o_rd.from_location_id, 
      o_rd.remark,
      o_rd.created_at, o_rd.created_uid, a_uc.user_nm,
      o_rd.updated_at, o_rd.updated_uid, a_uu.user_nm
    FROM out_release_detail_tb o_rd
    JOIN std_factory_tb s_f ON s_f.factory_id = o_rd.factory_id
    JOIN out_release_tb o_r ON o_r.release_id = o_rd.release_id
    LEFT JOIN mat_order_detail_tb m_od ON m_od.order_detail_id = o_rd.order_detail_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = o_rd.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = o_rd.updated_uid
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
      o_rd.uuid as release_detail_uuid,
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
      COALESCE(t_r.order_qty,0) as order_qty,
      t_r.lot_no,
      COALESCE(t_r.qty,0) as qty,
      t_r.price,
      s_mu.uuid as money_unit_uuid,
      s_mu.money_unit_cd,
      s_mu.money_unit_nm,
      t_r.exchange,
      COALESCE(t_r.supply_price,0) as supply_price,
      COALESCE(t_r.tax,0) as tax,
      COALESCE(t_r.total_price,0) as total_price,
      f_ss.uuid as from_store_uuid,
      f_ss.store_cd as from_store_cd,
      f_ss.store_nm as from_store_nm,
      f_sl.uuid as from_location_uuid,
      f_sl.location_cd as from_location_cd,
      f_sl.location_nm as from_location_nm,
      t_r.remark,
      t_r.created_at,
      t_r.created_uid,
      t_r.created_nm,
      t_r.updated_at,
      t_r.updated_uid,
      t_r.updated_nm
    FROM temp_release t_r
    LEFT JOIN out_release_detail_tb o_rd ON o_rd.release_detail_id = t_r.release_detail_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_r.factory_id
    LEFT JOIN std_partner_tb s_pn ON s_pn.partner_id = t_r.partner_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_r.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = t_r.money_unit_id
    LEFT JOIN std_store_tb f_ss ON f_ss.store_id = t_r.from_store_id
    LEFT JOIN std_location_tb f_sl ON f_sl.location_id = t_r.from_location_id
    ${reportOrderBy};
  `;

  const dropTempTable = `
    DROP TABLE temp_release;
  `;

  const query = `
    -- 📌 외주출고현황을 조회하기 위하여 임시테이블 생성
    ${createReleaseTempTable}

    -- 📌 임시테이블에 외주출고현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 외주출고현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readReleaseReport }