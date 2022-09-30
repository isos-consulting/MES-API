import moment from 'moment';

const readWorkPlanMonths = (
  params: {
    work_plan_month?: string,
    order_fg: boolean,
    factory_uuid?: string,
  }) => {
  let searchQuery: string = '';
	
	if (params.work_plan_month) { searchQuery += ` AND to_char(p_wpm.work_plan_month, 'YYYY-MM') = '${moment(params.work_plan_month).format('YYYY-MM')}'`; }  
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.order_fg) { searchQuery += ` AND ((p_wpm.work_plan_month_qty > COALESCE(p_o.qty, 0))) `; }
	
  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  //#region 📒 Main Query
  const query = `
		SELECT
      p_wpm.uuid as work_plan_month_uuid,
      s_f.uuid as factory_uuid, 
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
      p_wpm.work_plan_month_qty,
      to_char(p_wpm.work_plan_month, 'YYYY-MM') as work_plan_month,
      CASE WHEN (p_wpm.work_plan_month_qty - COALESCE(p_o.qty,0)) < 0 THEN 0 ELSE p_wpm.work_plan_month_qty - COALESCE(p_o.qty,0) END AS balance,  
      s_w.uuid as workings_uuid,
      s_w.workings_cd,
      s_w.workings_nm,
      p_wpm.created_at,
      a_uc.user_nm AS created_nm,
      p_wpm.updated_at,
      a_uu.user_nm AS updated_nm
    FROM prd_work_plan_month_tb p_wpm
    JOIN std_factory_tb s_f ON s_f.factory_id = p_wpm.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = p_wpm.prod_id
    JOIN std_workings_tb s_w ON s_w.workings_id = p_wpm.workings_id 
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id 
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_wpm.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_wpm.updated_uid
    LEFT JOIN (
      SELECT p_o.work_plan_month_id, SUM(p_o.qty) as qty
      FROM prd_order_tb p_o
      WHERE p_o.work_plan_month_id IS NOT NULL
      GROUP BY p_o.work_plan_month_id
    ) p_o ON p_o.work_plan_month_id = p_wpm.work_plan_month_id
		${searchQuery}
    ORDER BY p_wpm.work_plan_month_id;
  `;
  //#endregion

  return query;
}

export { readWorkPlanMonths }