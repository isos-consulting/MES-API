import moment from 'moment';

const readPlanDaily = (
  params: {
		start_date?: string,
		end_date?: string,
    plan_month?: string,
    wait_task_fg: boolean,
    factory_uuid?: string,
  }) => {
  let searchQuery: string = '';
	
	if (params.start_date && params.end_date) { searchQuery += ` AND date(p_pdt.plan_day) BETWEEN '${params.start_date}' AND '${params.end_date}'`;}
	if (params.plan_month) { searchQuery += ` AND to_char(p_pdt.plan_day, 'YYYY-MM') = '${moment(params.plan_month).format('YYYY-MM')}'`; }  
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.wait_task_fg) { searchQuery += ` AND ((p_pdt.plan_daily_qty > COALESCE(p_ot.qty, 0))) `; }
	
  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  //#region 📒 Main Query
  const query = `
		SELECT
      p_pdt.uuid as plan_daily_uuid,
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
			s_u.uuid as unit_uuid,
      s_u.unit_cd,
      s_u.unit_nm,
      p_pdt.plan_daily_qty,
      p_pdt.plan_day,
      CASE WHEN (p_pdt.plan_daily_qty - COALESCE(p_ot.qty,0)) < 0 THEN 0 ELSE p_pdt.plan_daily_qty - COALESCE(p_ot.qty,0) END AS balance,  
      s_w.uuid as workings_uuid,
      s_w.workings_cd,
      s_w.workings_nm,
      p_pdt.created_at,
      a_uc.user_nm AS created_nm,
      p_pdt.updated_at,
      a_uu.user_nm AS updated_nm
    FROM prd_plan_daily_tb p_pdt
    JOIN std_factory_tb s_f ON s_f.factory_id = p_pdt.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = p_pdt.prod_id
    JOIN std_workings_tb s_w ON s_w.workings_id = p_pdt.workings_id 
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id 
		LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_pdt.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_pdt.updated_uid
		LEFT JOIN prd_plan_monthly_tb p_pmt ON p_pmt.plan_monthly_id = p_pdt.plan_monthly_id
    LEFT JOIN (
      SELECT p_ot.plan_daily_id, SUM(p_ot.qty) as qty
      FROM prd_order_tb p_ot
      WHERE p_ot.plan_daily_id IS NOT NULL
      GROUP BY p_ot.plan_daily_id
    ) p_ot ON p_pdt.plan_daily_id = p_ot.plan_daily_id
		${searchQuery}
    ORDER BY s_p.prod_nm, p_pdt.plan_daily_qty;
  `;
  //#endregion

  return query;
}

export { readPlanDaily }