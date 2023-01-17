const readWorkerWorkPrice = (
  params: {
    reg_date: string,
    start_date: string,
    end_date: string,
    week_fg: boolean,
    start_date_year: string,
  }) => {
	
  let searchQuery = '';
  let groupQuery = 'ORDER BY d_s.date';
  
  if (params.week_fg) {
    searchQuery = `
      CEIL((EXTRACT(doy FROM to_date(d_s.date, 'YYYY-MM-DD')) + EXTRACT(DOW FROM to_date('${params.start_date_year}', 'YYYY-MM-DD'))) / 7) AS week,
      COALESCE(sum(t_w.worker), 0) AS worker,
      COALESCE(sum(t_t2.work_total_price), 0) AS work_total_price,
      CASE WHEN sum(t_w.worker) IS NULL THEN 0
        WHEN sum(t_w.worker) = 0 THEN 0
        ELSE (COALESCE(sum(t_t2.work_total_price), 0) / COALESCE(sum(t_w.worker), 1)) END rate
    `

    groupQuery = `
      GROUP BY week
      ORDER BY week
    `;
  } else {
    searchQuery = `
      d_s.date,
      COALESCE(t_w.worker, 0) AS worker,
      COALESCE(t_t2.work_total_price, 0) AS work_total_price,
      CASE WHEN t_w.worker IS NULL THEN 0
        WHEN t_w.worker = 0 THEN 0
        ELSE (COALESCE(t_t2.work_total_price, 0) / COALESCE(t_w.worker, 1)) END rate
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
        count(*) AS worker,
        to_char(p_w.reg_date, 'YYYY-MM-DD') AS reg_date
      FROM prd_work_worker_tb p_ww
      LEFT JOIN prd_work_tb p_w ON p_w.work_id = p_ww.work_id 
      WHERE to_char(p_w.reg_date, 'YYYY-MM') = '${params.reg_date}'
      GROUP BY to_char(p_w.reg_date, 'YYYY-MM-DD')
    ) t_w ON t_w.reg_date = d_s.date
    LEFT JOIN (
      SELECT
        to_char(reg_date, 'YYYY-MM-DD') AS reg_date,
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

const readWorkerWorkPriceMonth = (
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
      COALESCE(t_w.worker, 0) AS worker,
      COALESCE(t_t2.work_total_price, 0) AS work_total_price,
      CASE WHEN t_w.worker IS NULL THEN 0
        WHEN t_w.worker = 0 THEN 0
        ELSE (COALESCE(t_t2.work_total_price, 0) / COALESCE(t_w.worker, 1)) END rate
    FROM date_series d_s
    LEFT JOIN (
      SELECT 
        count(*) AS worker,
        to_char(p_w.reg_date, 'YYYY-MM') AS month_date
      FROM prd_work_worker_tb p_ww
      LEFT JOIN prd_work_tb p_w ON p_w.work_id = p_ww.work_id 
      WHERE to_char(p_w.reg_date, 'YYYY') = '${params.year}'
      GROUP BY month_date
    ) t_w ON t_w.month_date = d_s.month_date
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

export { readWorkerWorkPrice, readWorkerWorkPriceMonth }