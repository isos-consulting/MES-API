const readDemands = (
  params: {
    complete_state?: 'all' | 'complete' | 'incomplete'
    start_date?: string,
    end_date?: string,
    demand_uuid?: string,
    factory_uuid?: string,
    order_uuid?: string,
    to_store_uuid?: string,
  }
) => {
  let searchQuery: string = '';

  if (params.demand_uuid) { searchQuery = searchQuery.concat(` AND p_d.uuid = '${params.demand_uuid}'`); }
  if (params.factory_uuid) { searchQuery = searchQuery.concat(` AND s_f.uuid = '${params.factory_uuid}'`); }
  if (params.order_uuid) { searchQuery = searchQuery.concat(` AND p_o.uuid = '${params.order_uuid}'`); }
  if (params.to_store_uuid) { searchQuery = searchQuery.concat(` AND t_ss.uuid = '${params.to_store_uuid}'`); }
  if (params.start_date && params.end_date) { searchQuery = searchQuery.concat(` AND DATE(p_d.reg_date) BETWEEN '${params.start_date}' AND '${params.end_date}'`); }

  switch (params.complete_state) {
    case 'all': break;
    case 'complete': searchQuery = searchQuery.concat(` AND ((p_d.qty <= COALESCE(m_r.qty, 0)) OR p_d.complete_fg = TRUE)`); break;
    case 'incomplete': searchQuery = searchQuery.concat(` AND ((p_d.qty > COALESCE(m_r.qty, 0)) AND p_d.complete_fg = FALSE)`); break;
    default: break;
  }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const query = `
    SELECT
      p_d.uuid as demand_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      p_o.uuid as order_uuid,
      p_d.reg_date,
      p_d.demand_type_cd,
      a_dt.demand_type_nm,
      s_pc.uuid as proc_uuid,
      s_pc.proc_cd,
      s_pc.proc_nm,
      s_e.uuid as equip_uuid,
      s_e.equip_cd,
      s_e.equip_nm,
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
      p_d.qty,
      CASE WHEN (p_d.qty - COALESCE(m_r.qty,0)) < 0 THEN 0 ELSE p_d.qty - COALESCE(m_r.qty,0) END AS balance,
      p_d.complete_fg,
      CASE WHEN p_d.complete_fg = FALSE AND ((p_d.qty - COALESCE(m_r.qty,0)) > 0) THEN '미완료' ELSE '완료' END as complete_state,
      s_d.uuid as dept_uuid,
      s_d.dept_cd,
      s_d.dept_nm,
      p_d.due_date,
      t_ss.uuid as to_store_uuid,
      t_ss.store_cd as to_store_cd,
      t_ss.store_nm as to_store_nm,
      t_sl.uuid as to_location_uuid,
      t_sl.location_cd as to_location_cd,
      t_sl.location_nm as to_location_nm,
      p_d.remark,
      p_d.created_at,
      p_d.created_uid,
      a_uc.user_nm,
      p_d.updated_at,
      p_d.updated_uid,
      a_uu.user_nm
    FROM prd_demand_tb p_d
    JOIN std_factory_tb s_f ON s_f.factory_id = p_d.factory_id
    LEFT JOIN prd_order_tb p_o ON p_o.order_id = p_d.order_id
    LEFT JOIN std_proc_tb s_pc ON s_pc.proc_id = p_d.proc_id
    LEFT JOIN std_equip_tb s_e ON s_e.equip_id = p_d.equip_id
    JOIN std_prod_tb s_p ON s_p.prod_id = p_d.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_dept_tb s_d ON s_d.dept_id = p_d.dept_id
    LEFT JOIN adm_demand_type_vw a_dt ON a_dt.demand_type_cd = p_d.demand_type_cd
    LEFT JOIN std_store_tb t_ss ON t_ss.store_id = p_d.to_store_id
    LEFT JOIN std_location_tb t_sl ON t_sl.location_id = p_d.to_location_id
    LEFT JOIN (
      SELECT m_r.demand_id, SUM(m_r.qty) qty
      FROM mat_release_tb m_r
      WHERE m_r.demand_id IS NULL
      GROUP BY m_r.demand_id
    ) m_r ON m_r.demand_id = p_d.demand_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_d.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_d.updated_uid
    ${searchQuery}
    ORDER BY p_d.reg_date, p_d.demand_id;
  `;

  return query;
}

export { readDemands }