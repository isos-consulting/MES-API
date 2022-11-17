import moment from 'moment';

const readWorkRejectsRate = (
  params: {
    reg_date: string
  }) => {

	const reg_date = moment(params.reg_date).format('YYYYMMDD')
	const year = moment(reg_date).format('YYYY')

  //#region 📌 임시테이블 생성
  const createTempTable = `
    CREATE TEMP TABLE temp_table(
      proc_id int,
      work_qty_month01 numeric(19,6),
			work_qty_month02 numeric(19,6),
			work_qty_month03 numeric(19,6),
			work_qty_month04 numeric(19,6),
			work_qty_month05 numeric(19,6),
			work_qty_month06 numeric(19,6),
			work_qty_month07 numeric(19,6),
			work_qty_month08 numeric(19,6),
			work_qty_month09 numeric(19,6),
			work_qty_month10 numeric(19,6),
			work_qty_month11 numeric(19,6),
			work_qty_month12 numeric(19,6),
			reject_qty_month01 numeric(19,6),
			reject_qty_month02 numeric(19,6),
			reject_qty_month03 numeric(19,6),
			reject_qty_month04 numeric(19,6),
			reject_qty_month05 numeric(19,6),
			reject_qty_month06 numeric(19,6),
			reject_qty_month07 numeric(19,6),
			reject_qty_month08 numeric(19,6),
			reject_qty_month09 numeric(19,6),
			reject_qty_month10 numeric(19,6),
			reject_qty_month11 numeric(19,6),
			reject_qty_month12 numeric(19,6)
    );
    CREATE INDEX ON temp_table(proc_id);
  `;
  //#endregion

  //#region 📌 임시테이블 데이터 삽입
  const insertTempTable = `
    INSERT INTO temp_table
		SELECT 
			p_wr.proc_id 
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-01' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month01 
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-02' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month02
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-03' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month03
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-04' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month04
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-05' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month05
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-06' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month06
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-07' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month07
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-08' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month08
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-09' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month09
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-10' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month10
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-11' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month11
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-12' THEN COALESCE(p_wr.qty,0) + COALESCE(p_rj.reject_qty,0) END) AS work_qty_month12
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-01' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month01
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-02' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month02
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-03' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month03
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-04' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month04
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-05' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month05
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-06' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month06
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-07' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month07
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-08' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month08
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-09' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month09
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-10' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month10
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-11' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month11
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-12' THEN COALESCE(p_rj.reject_qty,0) END) AS reject_qty_month12
		FROM prd_work_tb p_w
		JOIN prd_work_routing_tb p_wr ON p_w.work_id = p_wr.work_id
		LEFT JOIN (SELECT work_routing_id, sum(qty) reject_qty FROM prd_work_reject_tb GROUP BY work_routing_id) p_rj ON p_rj.work_routing_id  = p_wr.work_routing_id 
		WHERE date_part('year', p_wr.start_date) = '${year}'
		GROUP BY p_wr.proc_id;
  `;

  //#endregion

  //#region 📌 추가 테이블 Join 및 조회
  // 📌 Filtering 되어있는 정보에 추가 테이블 Join 하여 조회
  const readQuery = `
	SELECT 
		s_p.proc_cd 
		,s_p.proc_nm 
		,COALESCE(work_qty.work_qty_month01,0) AS work_qty_month01 
		,COALESCE(work_qty.reject_qty_month01,0) AS reject_qty_month01
		,CASE WHEN COALESCE(work_qty.work_qty_month01,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month01,0)/COALESCE(work_qty.work_qty_month01,0) END rate_month01   
		,COALESCE(work_qty.work_qty_month02,0) AS work_qty_month02
		,COALESCE(work_qty.reject_qty_month02,0) AS reject_qty_month02
		,CASE WHEN COALESCE(work_qty.work_qty_month02,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month02,0)/COALESCE(work_qty.work_qty_month02,0) END rate_month02   
		,COALESCE(work_qty.work_qty_month03,0) AS work_qty_month03
		,COALESCE(work_qty.reject_qty_month03,0) AS reject_qty_month03
		,CASE WHEN COALESCE(work_qty.work_qty_month03,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month03,0)/COALESCE(work_qty.work_qty_month03,0) END rate_month03   
		,COALESCE(work_qty.work_qty_month04,0) AS work_qty_month04
		,COALESCE(work_qty.reject_qty_month04,0) AS reject_qty_month04
		,CASE WHEN COALESCE(work_qty.work_qty_month04,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month04,0)/COALESCE(work_qty.work_qty_month04,0) END rate_month04   
		,COALESCE(work_qty.work_qty_month05,0) AS work_qty_month05
		,COALESCE(work_qty.reject_qty_month05,0) AS reject_qty_month05
		,CASE WHEN COALESCE(work_qty.work_qty_month05,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month05,0)/COALESCE(work_qty.work_qty_month05,0) END rate_month05   
		,COALESCE(work_qty.work_qty_month06,0) AS work_qty_month06
		,COALESCE(work_qty.reject_qty_month06,0) AS reject_qty_month06
		,CASE WHEN COALESCE(work_qty.work_qty_month06,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month06,0)/COALESCE(work_qty.work_qty_month06,0) END rate_month06   
		,COALESCE(work_qty.work_qty_month07,0) AS work_qty_month07
		,COALESCE(work_qty.reject_qty_month07,0) AS reject_qty_month07
		,CASE WHEN COALESCE(work_qty.work_qty_month07,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month07,0)/COALESCE(work_qty.work_qty_month07,0) END rate_month07   
		,COALESCE(work_qty.work_qty_month08,0) AS work_qty_month08
		,COALESCE(work_qty.reject_qty_month08,0) AS reject_qty_month08
		,CASE WHEN COALESCE(work_qty.work_qty_month08,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month08,0)/COALESCE(work_qty.work_qty_month08,0) END rate_month08   
		,COALESCE(work_qty.work_qty_month09,0) AS work_qty_month09
		,COALESCE(work_qty.reject_qty_month09,0) AS reject_qty_month09
		,CASE WHEN COALESCE(work_qty.work_qty_month09,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month09,0)/COALESCE(work_qty.work_qty_month09,0) END rate_month09   
		,COALESCE(work_qty.work_qty_month10,0) AS work_qty_month10
		,COALESCE(work_qty.reject_qty_month10,0) AS reject_qty_month10
		,CASE WHEN COALESCE(work_qty.work_qty_month10,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month10,0)/COALESCE(work_qty.work_qty_month10,0) END rate_month10   
		,COALESCE(work_qty.work_qty_month11,0) AS work_qty_month11
		,COALESCE(work_qty.reject_qty_month11,0) AS reject_qty_month11
		,CASE WHEN COALESCE(work_qty.work_qty_month11,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month11,0)/COALESCE(work_qty.work_qty_month11,0) END rate_month11   
		,COALESCE(work_qty.work_qty_month12,0) AS work_qty_month12
		,COALESCE(work_qty.reject_qty_month12,0) AS reject_qty_month12
		,CASE WHEN COALESCE(work_qty.work_qty_month12,0) = 0 THEN 0 ELSE COALESCE(work_qty.reject_qty_month12,0)/COALESCE(work_qty.work_qty_month12,0) END rate_month12   
	FROM std_proc_tb s_p
	LEFT JOIN temp_table work_qty ON work_qty.proc_id = s_p.proc_id 
	ORDER BY s_p.proc_nm;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
    DROP TABLE temp_table;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 임시테이블 생성
    ${createTempTable}

    -- 임시테이블 데이터 insert
    ${insertTempTable}

    -- Filtering 되어있는 정보에 추가 테이블 Join 하여 조회
    ${readQuery}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readWorkRejectsRate }