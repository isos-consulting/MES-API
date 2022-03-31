const readOrderDetails = (
  params: {
    complete_state?: 'all' | 'complete' | 'incomplete'
    start_reg_date?: string,
    end_reg_date?: string,
    start_due_date?: string,
    end_due_date?: string
    order_detail_uuid?: string,
    order_uuid?: string,
    factory_uuid?: string,
    partner_uuid?: string,
  }
) => {
  let searchQuery: string = '';

  if (params.order_uuid) { searchQuery += ` AND m_o.uuid = '${params.order_uuid}'`; }
  if (params.order_detail_uuid) { searchQuery += ` AND m_od.uuid = '${params.order_detail_uuid}'`; }
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.partner_uuid) { searchQuery += ` AND s_pa.uuid = '${params.partner_uuid}'`; }
  if (params.start_reg_date && params.end_reg_date) { searchQuery += ` AND date(m_o.reg_date) BETWEEN '${params.start_reg_date}' AND '${params.end_reg_date}'`; }
  if (params.start_due_date && params.end_due_date) { searchQuery += ` AND date(m_od.due_date) BETWEEN '${params.start_due_date}' AND '${params.end_due_date}'`; }

  switch (params.complete_state) {
    case 'all': break;
    case 'complete': searchQuery = searchQuery.concat(` AND ((m_od.qty <= COALESCE(m_rd.qty, 0)) OR m_od.complete_fg = TRUE)`); break;
    case 'incomplete': searchQuery = searchQuery.concat(` AND ((m_od.qty > COALESCE(m_rd.qty, 0)) AND m_od.complete_fg = FALSE)`); break;
    default: break;
  }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }
  
  const query = `
    SELECT
      m_od.uuid AS order_detail_uuid,
      m_o.uuid AS order_uuid,
      m_od.seq,
      m_o.stmt_no,
      concat(m_o.stmt_no, '-', m_od.seq) as stmt_no_sub,
      s_f.uuid AS factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      s_p.uuid AS prod_uuid,
      s_p.prod_no,
      s_p.prod_nm,
      s_it.uuid AS item_type_uuid,
      s_it.item_type_cd,
      s_it.item_type_nm,
      s_pt.uuid AS prod_type_uuid,
      s_pt.prod_type_cd,
      s_pt.prod_type_nm,
      s_m.uuid AS model_uuid,
      s_m.model_cd,
      s_m.model_nm,
      s_p.rev,
      s_p.prod_std,
      s_u.uuid AS unit_uuid,
      s_u.unit_cd,
      s_u.unit_nm,
      s_s.uuid as to_store_uuid,
      s_p.qms_receive_insp_fg,
      s_s.store_cd as to_store_cd,
      s_s.store_nm as to_store_nm,
      s_l.uuid as to_location_uuid,
      s_l.location_cd to_location_cd,
      s_l.location_nm to_location_nm,
      m_od.qty,
      CASE WHEN (m_od.qty - COALESCE(m_rd.qty,0)) < 0 THEN 0 ELSE m_od.qty - COALESCE(m_rd.qty,0) END AS balance,
      m_od.complete_fg,
      CASE WHEN m_od.complete_fg = FALSE AND ((m_od.qty - COALESCE(m_rd.qty,0)) > 0) THEN '미완료' ELSE '완료' END as complete_state,
      m_od.price,
      s_mu.uuid AS money_unit_uuid,
      s_mu.money_unit_cd,
      s_mu.money_unit_nm,
      m_od.exchange,
      m_od.total_price,
      m_od.unit_qty,
      m_od.due_date,
      m_od.remark,
      m_od.created_at,
      a_uc.user_nm AS created_nm,
      m_od.updated_at,
      a_uu.user_nm AS updated_nm
    FROM mat_order_detail_tb m_od
    JOIN mat_order_tb m_o ON m_o.order_id = m_od.order_id
    JOIN std_factory_tb s_f ON s_f.factory_id = m_od.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = m_od.prod_id
    JOIN std_unit_tb s_u ON s_u.unit_id = m_od.unit_id
    JOIN std_partner_tb s_pa ON s_pa.partner_id = m_o.partner_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_store_tb s_s on s_s.store_id = s_p.inv_to_store_id
    LEFT JOIN std_location_tb s_l on s_l.location_id = s_p.inv_to_location_id
    JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = m_od.money_unit_id 
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = m_od.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = m_od.updated_uid
    LEFT JOIN (
      SELECT m_rd.order_detail_id, SUM(m_rd.qty) as qty
      FROM mat_receive_detail_tb m_rd
      WHERE m_rd.order_detail_id IS NOT NULL
      GROUP BY m_rd.order_detail_id
    ) m_rd ON m_rd.order_detail_id = m_od.order_detail_id
    ${searchQuery}
    ORDER BY m_od.factory_id, m_o.reg_date, m_od.order_id, m_od.seq, m_od.order_detail_id;
  `;

  return query;
}

export { readOrderDetails }