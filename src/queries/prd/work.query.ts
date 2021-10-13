const readWorks = (
  params: {
    start_date?: string,
    end_date?: string,
    work_uuid?: string,
    order_uuid?: string,
    factory_uuid?: string,
    prod_uuid?: string,
    complete_fg?: boolean
  }) => {
  let searchQuery: string = '';

  if (params.work_uuid) { searchQuery += ` AND p_w.uuid = '${params.work_uuid}'`; }
  if (params.order_uuid) { searchQuery += ` AND p_o.uuid = '${params.order_uuid}'`; }
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.prod_uuid) { searchQuery += ` AND s_p.uuid = '${params.prod_uuid}'`; }
  if (params.complete_fg != null) { searchQuery += ` AND p_w.complete_fg = ${params.complete_fg}`; }
  if (params.start_date && params.end_date) { searchQuery += ` AND p_w.reg_date BETWEEN '${params.start_date}' AND '${params.end_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  //#region 📒 Main Query
  const query = `
    SELECT 
      p_w.uuid as work_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      p_w.reg_date,
      p_o.uuid as order_uuid,
      p_o.order_no,
      p_w.seq,
      s_pc.uuid as proc_uuid,
      s_pc.proc_cd,
      s_pc.proc_nm,
      s_ws.uuid as workings_uuid,
      s_ws.workings_cd,
      s_ws.workings_nm,
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
      p_w.lot_no,
      p_o.qty as order_qty,
      (p_w.qty + p_w.reject_qty) as total_qty,
      p_w.qty,
      p_w.reject_qty,
      p_w.start_date,
      p_w.end_date,
      p_w.work_time,
      s_sf.uuid as shift_uuid,
      s_sf.shift_nm,
      CAST(COALESCE(p_ww.cnt,0) AS int) as worker_cnt,
      p_ww1.worker_nm,
      CASE WHEN p_w.complete_fg = TRUE THEN '완료' ELSE '미완료' END as complete_state,
      p_w.complete_fg,
      s_s.uuid as to_store_uuid,
      s_s.store_cd as to_store_cd,
      s_s.store_nm as to_store_nm,
      s_l.uuid as to_location_uuid,
      s_l.location_cd as to_location_cd,
      s_l.location_nm as to_location_nm,
      p_o.remark as order_remark,
      p_w.remark,
      p_w.created_at,
      p_w.created_uid,
      a_uc.user_nm as created_nm,
      p_w.updated_at,
      p_w.updated_uid,
      a_uu.user_nm as updated_nm
    FROM prd_work_tb p_w
    JOIN prd_order_tb p_o ON p_o.order_id = p_w.order_id
    JOIN std_factory_tb s_f ON s_f.factory_id = p_w.factory_id
    JOIN std_proc_tb s_pc ON s_pc.proc_id = p_w.proc_id
    JOIN std_workings_tb s_ws ON s_ws.workings_id = p_w.workings_id
    LEFT JOIN std_equip_tb s_e ON s_e.equip_id = p_w.equip_id
    JOIN std_prod_tb s_p ON s_p.prod_id = p_w.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    JOIN std_shift_tb s_sf ON s_sf.shift_id = p_w.shift_id
    LEFT JOIN std_store_tb s_s ON s_s.store_id = p_w.to_store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = p_w.to_location_id
    LEFT JOIN (	SELECT p_ww.work_id, count(*) AS cnt 
          FROM prd_work_worker_tb p_ww
          GROUP BY p_ww.work_id) p_ww ON p_ww.work_id = p_w.work_id
    LEFT JOIN (	SELECT p_ww.work_id, array_to_string(array_agg(s_w.worker_nm), ',', '') AS worker_nm
          FROM prd_work_worker_tb p_ww
          LEFT JOIN std_worker_tb s_w ON s_w.worker_id = p_ww.worker_id 
          GROUP BY p_ww.work_id) p_ww1 ON p_ww1.work_id = p_w.work_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_w.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_w.updated_uid
    ${searchQuery}
    ORDER BY p_w.reg_date;
  `;
  //#endregion

  return query;
}

export { readWorks }