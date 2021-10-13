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

  if (params.order_uuid) { searchQuery += ` AND s_o.uuid = '${params.order_uuid}'`; }
  if (params.order_detail_uuid) { searchQuery += ` AND s_od.uuid = '${params.order_detail_uuid}'`; }
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.partner_uuid) { searchQuery += ` AND s_pa.uuid = '${params.partner_uuid}'`; }
  if (params.start_reg_date && params.end_reg_date) { searchQuery += ` AND s_o.reg_date BETWEEN '${params.start_reg_date}' AND '${params.end_reg_date}'`; }
  if (params.start_due_date && params.end_due_date) { searchQuery += ` AND s_od.due_date BETWEEN '${params.start_due_date}' AND '${params.end_due_date}'`; }

  switch (params.complete_state) {
    case 'all': break;
    case 'complete': searchQuery = searchQuery.concat(` AND ((s_od.qty <= COALESCE(s_ogd.qty, 0)) OR s_od.complete_fg = TRUE)`); break;
    case 'incomplete': searchQuery = searchQuery.concat(` AND ((s_od.qty > COALESCE(s_ogd.qty, 0)) AND s_od.complete_fg = FALSE)`); break;
    default: break;
  }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }
  
  const query = `
    SELECT 
      s_od.uuid as order_detail_uuid,
      s_o.uuid as order_uuid,
      s_o.stmt_no,
      s_od.seq,
      s_o.stmt_no || '-' || s_od.seq as stmt_no,
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
      s_od.qty,
      CASE WHEN (s_od.qty - COALESCE(s_ogd.qty,0)) < 0 THEN 0 ELSE s_od.qty - COALESCE(s_ogd.qty,0) END AS balance,
      CASE WHEN s_od.complete_fg = FALSE AND ((s_od.qty - COALESCE(s_ogd.qty,0)) > 0) THEN '미완료' ELSE '완료' END as complete_state,
      s_od.price,
      s_mu.uuid as money_unit_uuid,
      s_mu.money_unit_cd,
      s_mu.money_unit_nm,
      s_od.exchange,
      s_od.total_price,
      s_od.unit_qty,
      s_od.due_date,
      s_od.remark,
      s_od.created_at,
      s_od.created_uid,
      a_uc.user_nm as created_nm,
      s_od.updated_at,
      s_od.updated_uid,
      a_uu.user_nm as updated_nm
    FROM sal_order_detail_tb s_od
    JOIN sal_order_tb s_o ON s_o.order_id = s_od.order_id
    JOIN std_factory_tb s_f ON s_f.factory_id = s_od.factory_id
    JOIN std_partner_tb s_pa ON s_pa.partner_id = s_o.partner_id
    JOIN std_prod_tb s_p ON s_p.prod_id = s_od.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = s_od.money_unit_id 
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = s_od.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = s_od.updated_uid
    LEFT JOIN (
      SELECT s_ogd.order_detail_id, SUM(s_ogd.qty) qty
      FROM sal_outgo_detail_tb s_ogd
      WHERE s_ogd.order_detail_id IS NULL
      GROUP BY s_ogd.order_detail_id
      ) s_ogd ON s_ogd.order_detail_id = s_od.order_detail_id
    ${searchQuery}
    ORDER BY s_od.factory_id, s_o.reg_date, s_od.order_id, s_od.seq, s_od.order_detail_id;
  `;

  return query;
}

export { readOrderDetails }