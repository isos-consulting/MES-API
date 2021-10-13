const readWaitingReceive = (
  params: {
    insp_detail_type: 'all' | 'matReceive' | 'outReceive'
    factory_uuid?: string,
    start_date?: string,
    end_date?: string
  }
) => {
  const readMaterialQuery = `
    SELECT 
      m_r.uuid as receive_uuid,
      m_rd.uuid as receive_detail_uuid,
      m_rd.seq,
      m_r.stmt_no,
      concat(m_r.stmt_no, '-', m_rd.seq) as stmt_no_sub,
      m_r.reg_date as reg_date,
      'MAT_RECEIVE' as insp_detail_type_cd,
      '자재수입검사' as insp_detail_type_nm,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      s_pa.uuid as partner_uuid,
      s_pa.partner_cd,
      s_pa.partner_nm,
      m_od.uuid as order_detail_uuid,
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
      m_rd.lot_no,
      m_od.qty as order_qty,
      m_rd.qty,
      m_rd.price,
      s_mu.uuid as money_unit_uuid,
      s_mu.money_unit_cd,
      s_mu.money_unit_nm,
      m_rd.exchange,
      m_rd.total_price,
      m_rd.unit_qty,
      m_rd.insp_fg,
      CASE WHEN m_rd.insp_fg = FALSE THEN '무검사' 
      ELSE CASE WHEN COALESCE(q_ir.cnt, 0) = 0 THEN '미완료' ELSE '완료' END END as insp_result,
      m_rd.carry_fg,
      s_s.uuid as to_store_uuid,
      s_s.store_cd as to_store_cd,
      s_s.store_nm as to_store_nm,
      s_l.uuid as to_location_uuid,
      s_l.location_cd as to_location_cd,
      s_l.location_nm as to_location_nm,
      m_rd.remark,
      m_rd.barcode,
      m_i.uuid as income_uuid,
      m_rd.created_at,
      m_rd.created_uid,
      a_uc.user_nm as created_nm,
      m_rd.updated_at,
      m_rd.updated_uid,
      a_uu.user_nm as updated_nm
    FROM mat_receive_detail_tb m_rd
    JOIN mat_receive_tb m_r ON m_r.receive_id = m_rd.receive_id
    JOIN std_factory_tb s_f ON s_f.factory_id = m_rd.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = m_rd.prod_id
    JOIN std_partner_tb s_pa ON s_pa.partner_id = m_r.partner_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = m_rd.money_unit_id
    LEFT JOIN mat_order_detail_tb m_od	ON m_od.order_detail_id = m_rd.order_detail_id
    LEFT JOIN std_store_tb s_s ON s_s.store_id = m_rd.to_store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = m_rd.to_location_id
    LEFT JOIN mat_income_tb m_i ON m_i.receive_detail_id = m_rd.receive_detail_id
    LEFT JOIN (	SELECT insp_reference_id, count(*) AS cnt 
      FROM qms_insp_result_tb
      WHERE insp_type_cd = 'RECEIVE_INSP'
      GROUP BY insp_reference_id) q_ir 	ON q_ir.insp_reference_id = m_rd.receive_detail_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = m_rd.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = m_rd.updated_uid
    WHERE (m_rd.insp_fg = TRUE AND COALESCE(q_ir.cnt, 0) = 0)
    ${params.factory_uuid ? `AND s_f.uuid = '${params.factory_uuid}'` : ''}
    ${params.start_date && params.end_date ? ` AND m_r.reg_date BETWEEN '${params.start_date}' AND '${params.end_date}'` : ''}
  `

  const readOutsourcingQuery = `
    SELECT 
      o_r.uuid as receive_uuid,
      o_rd.uuid as receive_detail_uuid,
      o_rd.seq,
      o_r.stmt_no,
      concat(o_r.stmt_no, '-', o_rd.seq) as stmt_no_sub,
      o_r.reg_date as reg_date,
      'OUT_RECEIVE' as insp_detail_type_cd,
      '외주수입검사' as insp_detail_type_nm,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      s_pa.uuid as partner_uuid,
      s_pa.partner_cd,
      s_pa.partner_nm,
      m_od.uuid as order_detail_uuid,
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
      m_od.qty as order_qty,
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
      m_i.uuid as income_uuid,
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
    JOIN std_partner_tb s_pa ON s_pa.partner_id = o_r.partner_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = o_rd.money_unit_id
    LEFT JOIN mat_order_detail_tb m_od	ON m_od.order_detail_id = o_rd.order_detail_id
    LEFT JOIN std_store_tb s_s ON s_s.store_id = o_rd.to_store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = o_rd.to_location_id
    LEFT JOIN mat_income_tb m_i ON m_i.receive_detail_id = o_rd.receive_detail_id
    LEFT JOIN (	SELECT insp_reference_id, count(*) AS cnt 
      FROM qms_insp_result_tb
      WHERE insp_type_cd = 'RECEIVE_INSP'
      GROUP BY insp_reference_id) q_ir 	ON q_ir.insp_reference_id = o_rd.receive_detail_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = o_rd.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = o_rd.updated_uid
    WHERE (o_rd.insp_fg = TRUE AND COALESCE(q_ir.cnt, 0) = 0)
    ${params.factory_uuid ? `AND s_f.uuid = '${params.factory_uuid}'` : ''}
    ${params.start_date && params.end_date ? ` AND o_r.reg_date BETWEEN '${params.start_date}' AND '${params.end_date}'` : ''}
  `

  let query: string;
  switch (params.insp_detail_type) {
    case 'all': 
      query = `
        ${readMaterialQuery}
        UNION ALL
        ${readOutsourcingQuery}
        ORDER BY factory_uuid, reg_date, receive_uuid, seq, receive_detail_uuid;
      `;
      break;
    case 'matReceive':
      query = `
        ${readMaterialQuery}
        ORDER BY m_rd.factory_id, m_r.reg_date, m_rd.receive_id, m_rd.seq, m_rd.receive_detail_id;
      `;
      break;
    case 'outReceive':
      query = `
        ${readOutsourcingQuery}
        ORDER BY o_rd.factory_id, o_r.reg_date, o_rd.receive_id, o_rd.seq, o_rd.receive_detail_id;
      `;
      break;
    default: query = ''; break;
  }

  return query;
}

export { readWaitingReceive }