const readOrderWork = (
  params: {
    reg_date: string,
    start_date: string,
    end_date: string,
    week_fg: boolean
  }) => {
	
  let searchQuery = '';
  let groupQuery = 'ORDER BY d_s.date';
  
  if (params.week_fg) {
    searchQuery = `
      to_char(to_date(d_s.date, 'YYYY-MM-DD'), 'WW') AS week,
      COALESCE(sum(t_t.order_total_price), 0) AS order_total_price,
      COALESCE(sum(t_t2.work_total_price), 0) AS work_total_price,
      (COALESCE(sum(t_t2.work_total_price), 0) / COALESCE(sum(t_t.order_total_price), 1)) * 100 AS rate
    `

    groupQuery = `
      GROUP BY week
      ORDER BY week
    `;
  } else {
    searchQuery = `
      d_s.date,
      COALESCE(t_t.order_total_price, 0) AS order_total_price,
      COALESCE(t_t2.work_total_price, 0) AS work_total_price,
      (COALESCE(t_t2.work_total_price, 0) / COALESCE(t_t.order_total_price, 1)) * 100 AS rate
    `;
  }

  //#region 📒 Main Query
  const query = `
    -- 조회
    WITH date_series AS (
      SELECT
        to_char(DATE(GENERATE_SERIES(DATE '${params.start_date}', DATE '${params.end_date}','1 day')), 'YYYY-MM-DD') AS date
    )
    
    SELECT
      ${searchQuery}
    FROM date_series d_s
    LEFT JOIN (
      SELECT 
        to_char(reg_date, 'YYYY-MM-DD') AS reg_date,
        sum(pot.qty * s_p.work_price) AS order_total_price,
        null
      FROM prd_order_tb pot 
      JOIN std_prod_tb s_p ON s_p.prod_id = pot.prod_id 
      WHERE to_char(reg_date, 'YYYY-MM') = '${params.reg_date}'
      GROUP BY to_char(reg_date, 'YYYY-MM-DD')
    ) t_t ON t_t.reg_date = d_s.date
    LEFT JOIN (
      SELECT
        to_char(reg_date, 'YYYY-MM-DD') AS reg_date,
        null,
        sum(p_w.qty * s_p.work_price) AS work_total_price
      FROM prd_work_tb p_w
      LEFT JOIN std_prod_tb s_p ON s_p.prod_id = p_w.prod_id 
      WHERE to_char(p_w.reg_date, 'YYYY-MM') = '${params.reg_date}'
      GROUP BY to_char(p_w.reg_date, 'YYYY-MM-DD')
    ) t_t2 ON t_t2.reg_date = d_s.date
    ${groupQuery};
    
  `;
  //#endregion

  return query;
}

const readOrderWorkMonth = (
  params: {
    reg_date: string,
    year: string
  }) => {

  //#region 📒 Main Query
  const query = `
    -- 조회
    WITH date_series AS (
      SELECT
        to_char(DATE(GENERATE_SERIES(DATE '${params.year}-01-01', DATE '${params.year}-12-01','1 month')), 'YYYY-MM') AS month_date
    )
    
    SELECT 
      d_s.month_date,
      COALESCE(t_t.plan_total_price, 0) AS plan_total_price,
      COALESCE(t_t2.work_total_price, 0) AS work_total_price,
      (COALESCE(t_t2.work_total_price, 0) / COALESCE(t_t.plan_total_price, 1)) * 100 AS rate
    FROM date_series d_s
    LEFT JOIN (
      SELECT 
        to_char(p_pm.plan_month, 'YYYY-MM') AS month_date,
        sum(p_pm.plan_monthly_qty  * s_p.work_price) AS plan_total_price
      FROM prd_plan_monthly_tb p_pm
      LEFT JOIN std_prod_tb s_p ON s_p.prod_id = p_pm.prod_id 
      WHERE to_char(p_pm.plan_month, 'YYYY') = '${params.year}'
      GROUP BY month_date
    ) t_t ON t_t.month_date = d_s.month_date
    LEFT JOIN (
      SELECT
        to_char(reg_date, 'YYYY-MM') AS month_date,
        sum(p_w.qty * s_p.work_price) AS work_total_price
      FROM prd_work_tb p_w
      LEFT JOIN std_prod_tb s_p ON s_p.prod_id = p_w.prod_id 
      WHERE to_char(p_w.reg_date, 'YYYY') = '${params.year}'
      GROUP BY month_date	
    ) t_t2 ON t_t2.month_date = d_s.month_date;
  `;
  //#endregion

  return query;
}

export { readOrderWork, readOrderWorkMonth }