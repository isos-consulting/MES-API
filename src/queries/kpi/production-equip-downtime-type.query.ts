const readEquipDowntimeTypeWeek = (
  params: {
    reg_date: string,
    start_date: string,
    end_date: string,
    start_date_year: string,
  }) => {
	
  //#region 📒 Main Query
  const query = `
    -- 조회
    WITH date_series AS (
      SELECT
        to_char(DATE(GENERATE_SERIES(DATE '${params.start_date}', DATE '${params.end_date}','1 day')), 'YYYY-MM-DD') AS date
    )
    
    SELECT
			CEIL((EXTRACT(doy FROM to_date(d_s.date, 'YYYY-MM-DD')) + EXTRACT(DOW FROM to_date('${params.start_date_year}', 'YYYY-MM-DD'))) / 7) AS week,
			sum(t_t.diff_hour) AS diff_hour,
			s_dt.downtime_type_cd,
			s_dt.downtime_type_nm
		FROM date_series d_s
			LEFT JOIN (
				SELECT
					to_char(t_t.end_date, 'YYYY-MM-DD') AS end_date,	
					sum(EXTRACT (EPOCH FROM (end_date - start_date))) / 3600 AS diff_hour,
					t_t.downtime_type_id
				FROM (
					SELECT 
						pwdt.start_date AS start_date,
						pwdt.end_date AS end_date,
						sdt.downtime_id AS downtime_id,
						sdt.downtime_type_id AS downtime_type_id
					FROM prd_work_downtime_tb pwdt 
					LEFT JOIN std_downtime_tb sdt ON sdt.downtime_id = pwdt.downtime_id 	
				) t_t
				WHERE to_char(t_t.end_date, 'YYYY-MM') = '${params.reg_date}' OR t_t.end_date IS NULL
				GROUP BY t_t.downtime_type_id, end_date
			) t_t ON t_t.end_date = d_s.date
		RIGHT JOIN std_downtime_type_tb s_dt ON s_dt.downtime_type_id = t_t.downtime_type_id
		GROUP BY week, s_dt.downtime_type_cd, s_dt.downtime_type_nm
		ORDER BY week;
    
  `;
  //#endregion

  return query;
}

const readEquipDowntimeTypeMonth = (
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
			sum(t_t.diff_hour) AS diff_hour,
			s_dt.downtime_type_cd,
			s_dt.downtime_type_nm 
		FROM date_series d_s
			LEFT JOIN (
				SELECT
					to_char(t_t.end_date, 'YYYY-MM') AS end_date,	
					sum(EXTRACT (EPOCH FROM (end_date - start_date))) / 3600 AS diff_hour,
					t_t.downtime_type_id
				FROM (
					SELECT 
						pwdt.start_date AS start_date,
						pwdt.end_date AS end_date,
						sdt.downtime_id AS downtime_id,
						sdt.downtime_type_id AS downtime_type_id
					FROM prd_work_downtime_tb pwdt 
					LEFT JOIN std_downtime_tb sdt ON sdt.downtime_id = pwdt.downtime_id 	
				) t_t
				WHERE to_char(t_t.end_date, 'YYYY') = '${params.year}' OR t_t.end_date IS NULL
				GROUP BY t_t.downtime_type_id, end_date
			) t_t ON t_t.end_date = d_s.month_date
		RIGHT JOIN std_downtime_type_tb s_dt ON s_dt.downtime_type_id = t_t.downtime_type_id
		GROUP BY d_s.month_date, s_dt.downtime_type_cd, s_dt.downtime_type_nm 
		ORDER BY d_s.month_date;
  `;
  //#endregion

  return query;
}

export { readEquipDowntimeTypeWeek, readEquipDowntimeTypeMonth }