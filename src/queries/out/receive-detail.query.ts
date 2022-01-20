const readReceiveDetails = (receiveDetailUuid?: string, receiveUuid?: string, factoryUuid?: string, partnerUuid?: string, completeState?: 'all' | 'complete' | 'incomplete', startDate?: string, endDate?: string) => {
  let searchQuery: string = '';

  if (receiveUuid) { searchQuery += ` AND o_r.uuid = '${receiveUuid}'`; }
  if (receiveDetailUuid) { searchQuery += ` AND o_rd.uuid = '${receiveDetailUuid}'`; }
  if (factoryUuid) { searchQuery += ` AND s_f.uuid = '${factoryUuid}'`; }
  if (partnerUuid) { searchQuery += ` AND s_pa.uuid = '${partnerUuid}'`; }
  if (startDate && endDate) { searchQuery += ` AND date(o_r.reg_date) BETWEEN '${startDate}' AND '${endDate}'`; }

  switch (completeState) {
    case 'all': break;
    case 'complete': searchQuery = searchQuery.concat(` AND (o_rd.insp_fg = TRUE AND COALESCE(q_ir.cnt, 0) <> 0)`); break;
    case 'incomplete': searchQuery = searchQuery.concat(` AND (o_rd.insp_fg = TRUE AND COALESCE(q_ir.cnt, 0) = 0)`); break;
    default: break;
  }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }
  
  const query = `
    SELECT 
      o_r.uuid as receive_uuid,
      o_rd.uuid as receive_detail_uuid,
      o_rd.seq,
      o_r.stmt_no,
      concat(o_r.stmt_no, '-', o_rd.seq) as stmt_no_sub,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      m_od.uuid AS order_detail_uuid,
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
      s_p.inv_safe_qty,
      o_rd.lot_no,
      o_rd.manufactured_lot_no,
      COALESCE(m_od.qty, 0) as order_qty,
      o_rd.qty,
      o_rd.price,
      s_mu.uuid as money_unit_uuid,
      s_mu.money_unit_cd,
      s_mu.money_unit_nm,
      o_rd.exchange,
      o_rd.total_price,
      o_rd.unit_qty,
      o_rd.insp_fg,
      CASE WHEN o_rd.insp_fg = FALSE THEN '무검사' 
      ELSE CASE WHEN COALESCE(q_ir.cnt, 0) = 0 THEN '미완료' ELSE '완료' END END as insp_result,
      o_rd.carry_fg,
      s_s.uuid as to_store_uuid,
      s_s.store_cd as to_store_cd,
      s_s.store_nm as to_store_nm,
      s_l.uuid as to_location_uuid,
      s_l.location_cd as to_location_cd,
      s_l.location_nm as to_location_nm,
      o_rd.remark,
      o_rd.barcode,
      o_i.uuid as income_uuid,
      o_rd.created_at,
      o_rd.created_uid,
      a_uc.user_nm as created_nm,
      o_rd.updated_at,
      o_rd.updated_uid,
      a_uu.user_nm as updated_nm
    FROM out_receive_detail_tb o_rd
    JOIN out_receive_tb o_r ON o_r.receive_id = o_rd.receive_id
    JOIN std_factory_tb s_f ON s_f.factory_id = o_rd.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = o_rd.prod_id
    JOIN std_unit_tb s_u ON s_u.unit_id = o_rd.unit_id
    JOIN std_partner_tb s_pa ON s_pa.partner_id = o_r.partner_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = o_rd.money_unit_id
    LEFT JOIN mat_order_detail_tb m_od	ON m_od.order_detail_id = o_rd.order_detail_id
    LEFT JOIN std_store_tb s_s ON s_s.store_id = o_rd.to_store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = o_rd.to_location_id
    LEFT JOIN out_income_tb o_i ON o_i.receive_detail_id = o_rd.receive_detail_id
    LEFT JOIN (	SELECT insp_reference_id, count(*) AS cnt 
      FROM qms_insp_result_tb
      WHERE insp_type_cd = 'RECEIVE_INSP'
      GROUP BY insp_reference_id) q_ir 	ON q_ir.insp_reference_id = o_rd.receive_detail_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = o_rd.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = o_rd.updated_uid
    ${searchQuery}
    ORDER BY o_rd.factory_id, o_r.reg_date, o_rd.receive_id, o_rd.seq, o_rd.receive_detail_id;
  `;

  return query;
}

export { readReceiveDetails }