import moment from 'moment';

const readPlanMonthly = (
  params: {
    plan_month?: string,
    wait_task_fg: boolean,
    factory_uuid?: string,
  }) => {
  let searchQuery: string = '';
	
	if (params.plan_month) { searchQuery += ` AND to_char(p_pmt.plan_month, 'YYYY-MM') = '${moment(params.plan_month).format('YYYY-MM')}'`; }  
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.wait_task_fg) { searchQuery += ` AND ((p_pmt.plan_monthly_qty > COALESCE(p_pdt.qty, 0))) `; }
	
  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  //#region 📒 Main Query
  const query = `
		SELECT
      p_pmt.uuid as plan_monthly_uuid,
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
      p_pmt.plan_monthly_qty,
      to_char(p_pmt.plan_month, 'YYYY-MM') as plan_month,
      CASE WHEN (p_pmt.plan_monthly_qty - COALESCE(p_pdt.qty,0)) < 0 THEN 0 ELSE p_pmt.plan_monthly_qty - COALESCE(p_pdt.qty,0) END AS balance,  
      s_w.uuid as workings_uuid,
      s_w.workings_cd,
      s_w.workings_nm,
      p_pmt.created_at,
      a_uc.user_nm AS created_nm,
      p_pmt.updated_at,
      a_uu.user_nm AS updated_nm
    FROM prd_plan_monthly_tb p_pmt
    JOIN std_factory_tb s_f ON s_f.factory_id = p_pmt.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = p_pmt.prod_id
    JOIN std_workings_tb s_w ON s_w.workings_id = p_pmt.workings_id 
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id 
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_pmt.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_pmt.updated_uid
    LEFT JOIN (
      SELECT p_pdt.plan_monthly_id, SUM(p_pdt.plan_daily_qty) as qty
      FROM prd_plan_daily_tb p_pdt
      WHERE p_pdt.plan_monthly_id IS NOT NULL
      GROUP BY p_pdt.plan_monthly_id
    ) p_pdt ON p_pdt.plan_monthly_id = p_pmt.plan_monthly_id
		${searchQuery}
    ORDER BY s_p.prod_nm,p_pmt.plan_monthly_qty;
  `;
  //#endregion

  return query;
}

export { readPlanMonthly }