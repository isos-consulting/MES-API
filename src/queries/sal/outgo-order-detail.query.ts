const readOrderDetails = (
  params: {
    complete_state?: 'all' | 'complete' | 'incomplete'
    start_date?: string,
    end_date?: string,
    outgo_order_uuid?: string,
    outgo_order_detail_uuid?: string,
    factory_uuid?: string,
    partner_uuid?: string,
  }
) => {
  let searchQuery: string = '';

  if (params.outgo_order_detail_uuid) { searchQuery = searchQuery.concat(` AND s_ood.uuid = '${params.outgo_order_detail_uuid}'`); }
  if (params.outgo_order_uuid) { searchQuery = searchQuery.concat(` AND s_oo.uuid = '${params.outgo_order_uuid}'`); }
  if (params.factory_uuid) { searchQuery = searchQuery.concat(` AND s_f.uuid = '${params.factory_uuid}'`); }
  if (params.partner_uuid) { searchQuery = searchQuery.concat(` AND s_pa.uuid = '${params.partner_uuid}'`); }
  if (params.start_date && params.end_date) { searchQuery = searchQuery.concat(` AND s_oo.reg_date BETWEEN '${params.start_date}' AND '${params.end_date}'`); }

  switch (params.complete_state) {
    case 'all': break;
    case 'complete': searchQuery = searchQuery.concat(` AND ((s_ood.qty <= COALESCE(s_ogd.qty, 0)) OR s_ood.complete_fg = TRUE)`); break;
    case 'incomplete': searchQuery = searchQuery.concat(` AND ((s_ood.qty > COALESCE(s_ogd.qty, 0)) AND s_ood.complete_fg = FALSE)`); break;
    default: break;
  }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const query = `
    SELECT 
      s_oo.uuid as outgo_order_uuid,
      s_ood.uuid as outgo_order_detail_uuid,
      s_ood.seq,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      s_od.uuid as order_detail_uuid,
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
      s_od.qty as order_qty,
      s_ood.qty,
      CASE WHEN (s_ood.qty - COALESCE(s_ogd.qty,0)) < 0 THEN 0 ELSE s_ood.qty - COALESCE(s_ogd.qty,0) END AS balance,
      s_ood.complete_fg,
      CASE WHEN s_ood.complete_fg = FALSE AND ((s_ood.qty - COALESCE(s_ogd.qty,0)) > 0) THEN '미완료' ELSE '완료' END as complete_state,
      s_ood.remark,
      s_ood.created_at,
      s_ood.created_uid,
      a_uc.user_nm as created_nm,
      s_ood.updated_at,
      s_ood.updated_uid,
      a_uu.user_nm as updated_nm
    FROM sal_outgo_order_detail_tb s_ood
    JOIN sal_outgo_order_tb s_oo ON s_oo.outgo_order_id = s_ood.outgo_order_id
    JOIN std_factory_tb s_f ON s_f.factory_id = s_ood.factory_id
    JOIN std_partner_tb s_pa ON s_pa.partner_id = s_oo.partner_id
    JOIN std_prod_tb s_p ON s_p.prod_id = s_ood.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN sal_order_detail_tb s_od	ON s_od.order_detail_id = s_ood.order_detail_id
    LEFT JOIN (
      SELECT s_ogd.order_detail_id, SUM(s_ogd.qty) qty
      FROM sal_outgo_detail_tb s_ogd
      WHERE s_ogd.order_detail_id IS NULL
      GROUP BY s_ogd.order_detail_id
      ) s_ogd ON s_ogd.order_detail_id = s_od.order_detail_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = s_ood.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = s_ood.updated_uid
    ${searchQuery}
    ORDER BY s_ood.outgo_order_id, s_ood.outgo_order_detail_id;
  `;

  return query;
}

export { readOrderDetails }