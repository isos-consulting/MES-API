import moment from 'moment';

const readWorkPlanAchievementRate = (
  params: {
    reg_date: string
  }) => {

	const reg_date = moment(params.reg_date).format('YYYYMMDD')
	const year = moment(reg_date).format('YYYY')

  //#region 📌 지시임시테이블 생성
  const createOrderTempTable = `
    CREATE TEMP TABLE temp_order(
      proc_id int,
      sum01 numeric(19,6),
			sum02 numeric(19,6),
			sum03 numeric(19,6),
			sum04 numeric(19,6),
			sum05 numeric(19,6),
			sum06 numeric(19,6),
			sum07 numeric(19,6),
			sum08 numeric(19,6),
			sum09 numeric(19,6),
			sum10 numeric(19,6),
			sum11 numeric(19,6),
			sum12 numeric(19,6)
    );
    CREATE INDEX ON temp_order(proc_id);
  `;
  //#endregion

	//#region 📌 생산임시테이블 생성
  const createWorkTempTable = `
    CREATE TEMP TABLE temp_work(
      proc_id int,
      sum01 numeric(19,6),
			sum02 numeric(19,6),
			sum03 numeric(19,6),
			sum04 numeric(19,6),
			sum05 numeric(19,6),
			sum06 numeric(19,6),
			sum07 numeric(19,6),
			sum08 numeric(19,6),
			sum09 numeric(19,6),
			sum10 numeric(19,6),
			sum11 numeric(19,6),
			sum12 numeric(19,6)
    );
    CREATE INDEX ON temp_work(proc_id);
  `;
  //#endregion

  //#region 📌 임시테이블 데이터 삽입
  const insertToOrderTempTable = `
    INSERT INTO temp_order
		SELECT 
			p_or.proc_id 
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-01' THEN COALESCE(p_o.qty,0) END) AS sum01
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-02' THEN COALESCE(p_o.qty,0) END) AS sum02
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-03' THEN COALESCE(p_o.qty,0) END) AS sum03
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-04' THEN COALESCE(p_o.qty,0) END) AS sum04
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-05' THEN COALESCE(p_o.qty,0) END) AS sum05
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-06' THEN COALESCE(p_o.qty,0) END) AS sum06
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-07' THEN COALESCE(p_o.qty,0) END) AS sum07
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-08' THEN COALESCE(p_o.qty,0) END) AS sum08
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-09' THEN COALESCE(p_o.qty,0) END) AS sum09
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-10' THEN COALESCE(p_o.qty,0) END) AS sum10
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-11' THEN COALESCE(p_o.qty,0) END) AS sum11
			, sum(CASE WHEN to_char(p_o.reg_date ,'YYYY-MM') = '${year}' ||'-12' THEN COALESCE(p_o.qty,0) END) AS sum12
		FROM prd_order_tb p_o 
		JOIN prd_order_routing_tb p_or ON p_o.order_id = p_or.order_id 
		WHERE to_char(p_o.reg_date ,'YYYY') = '${year}'
		GROUP BY p_or.proc_id;
  `;

	const insertToWorkTempTable = `
    INSERT INTO temp_work
		SELECT 
			p_wr.proc_id 
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-01' THEN COALESCE(p_wr.qty,0) END) AS sum01
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-02' THEN COALESCE(p_wr.qty,0) END) AS sum02
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-03' THEN COALESCE(p_wr.qty,0) END) AS sum03
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-04' THEN COALESCE(p_wr.qty,0) END) AS sum04
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-05' THEN COALESCE(p_wr.qty,0) END) AS sum05
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-06' THEN COALESCE(p_wr.qty,0) END) AS sum06
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-07' THEN COALESCE(p_wr.qty,0) END) AS sum07
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-08' THEN COALESCE(p_wr.qty,0) END) AS sum08
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-09' THEN COALESCE(p_wr.qty,0) END) AS sum09
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-12' THEN COALESCE(p_wr.qty,0) END) AS sum12
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-10' THEN COALESCE(p_wr.qty,0) END) AS sum10
			, sum(CASE WHEN to_char(p_wr.start_date ,'YYYY-MM') = '${year}' ||'-11' THEN COALESCE(p_wr.qty,0) END) AS sum11
		FROM prd_work_tb p_w 
		JOIN prd_work_routing_tb p_wr ON p_wr.work_id = p_w.work_id
		WHERE to_char(p_wr.start_date ,'YYYY') = '${year}'
		AND p_w.complete_fg = TRUE
		GROUP BY p_wr.proc_id;
  `;

  //#endregion

  //#region 📌 추가 테이블 Join 및 조회
  // 📌 Filtering 되어있는 정보에 추가 테이블 Join 하여 조회
  const readQuery = `
    SELECT 
			s_p.proc_id 
			,s_p.proc_cd 
			,s_p.proc_nm 
			,COALESCE(p_o.sum01,0)+COALESCE(p_o.sum02,0)+COALESCE(p_o.sum03,0)+COALESCE(p_o.sum04,0)+COALESCE(p_o.sum05,0)+COALESCE(p_o.sum06,0)
				+COALESCE(p_o.sum07,0)+COALESCE(p_o.sum08,0)+COALESCE(p_o.sum09,0)+COALESCE(p_o.sum10,0)+COALESCE(p_o.sum11,0)+COALESCE(p_o.sum12,0) AS sum_order_qty
			,COALESCE(p_w.sum01,0)+COALESCE(p_w.sum02,0)+COALESCE(p_w.sum03,0)+COALESCE(p_w.sum04,0)+COALESCE(p_w.sum05,0)+COALESCE(p_w.sum06,0)
				+COALESCE(p_w.sum07,0)+COALESCE(p_w.sum08,0)+COALESCE(p_w.sum09,0)+COALESCE(p_w.sum10,0)+COALESCE(p_w.sum11,0)+COALESCE(p_w.sum12,0) AS sum_work_qty
			, CASE WHEN COALESCE(COALESCE(p_o.sum01,0)+COALESCE(p_o.sum02,0)+COALESCE(p_o.sum03,0)+COALESCE(p_o.sum04,0)+COALESCE(p_o.sum05,0)+COALESCE(p_o.sum06,0)
					+COALESCE(p_o.sum07,0)+COALESCE(p_o.sum08,0)+COALESCE(p_o.sum09,0)+COALESCE(p_o.sum10,0)+COALESCE(p_o.sum11,0)+COALESCE(p_o.sum12,0),0)=0 then 0 
				ELSE (COALESCE(p_w.sum01,0)+COALESCE(p_w.sum02,0)+COALESCE(p_w.sum03,0)+COALESCE(p_w.sum04,0)+COALESCE(p_w.sum05,0)+COALESCE(p_w.sum06,0)
					+COALESCE(p_w.sum07,0)+COALESCE(p_w.sum08,0)+COALESCE(p_w.sum09,0)+COALESCE(p_w.sum10,0)+COALESCE(p_w.sum11,0)+COALESCE(p_w.sum12,0))/(COALESCE(p_o.sum01,0)+COALESCE(p_o.sum02,0)+COALESCE(p_o.sum03,0)+COALESCE(p_o.sum04,0)+COALESCE(p_o.sum05,0)+COALESCE(p_o.sum06,0)
					+COALESCE(p_o.sum07,0)+COALESCE(p_o.sum08,0)+COALESCE(p_o.sum09,0)+COALESCE(p_o.sum10,0)+COALESCE(p_o.sum11,0)+COALESCE(p_o.sum12,0)) END AS sum_rate
			,COALESCE(p_o.sum01,0) AS order_month_1
			,COALESCE(p_w.sum01,0) AS work_month_1
			, CASE WHEN COALESCE(p_o.sum01,0)=0 then 0 ELSE COALESCE(p_w.sum01/p_o.sum01,0) END AS rate_month_1
			,COALESCE(p_o.sum02,0) AS order_month_2
			,COALESCE(p_w.sum02,0) AS work_month_2
			, CASE WHEN COALESCE(p_o.sum02,0)=0 then 0 ELSE COALESCE(p_w.sum02/p_o.sum02,0) END AS rate_month_2
			,COALESCE(p_o.sum03,0) AS order_month_3
			,COALESCE(p_w.sum03,0) AS work_month_3
			, CASE WHEN COALESCE(p_o.sum03,0)=0 then 0 ELSE COALESCE(p_w.sum03/p_o.sum03,0) END AS rate_month_3
			,COALESCE(p_o.sum04,0) AS order_month_4
			,COALESCE(p_w.sum04,0) AS work_month_4
			, CASE WHEN COALESCE(p_o.sum04,0)=0 then 0 ELSE COALESCE(p_w.sum04/p_o.sum04,0) END AS rate_month_4
			,COALESCE(p_o.sum05,0) AS order_month_5
			,COALESCE(p_w.sum05,0) AS work_month_5
			, CASE WHEN COALESCE(p_o.sum05,0)=0 then 0 ELSE COALESCE(p_w.sum05/p_o.sum05,0) END AS rate_month_5
			,COALESCE(p_o.sum06,0) AS order_month_6
			,COALESCE(p_w.sum06,0) AS work_month_6
			, CASE WHEN COALESCE(p_o.sum06,0)=0 then 0 ELSE COALESCE(p_w.sum06/p_o.sum06,0) END AS rate_month_6
			,COALESCE(p_o.sum07,0) AS order_month_7
			,COALESCE(p_w.sum07,0) AS work_month_7
			, CASE WHEN COALESCE(p_o.sum07,0)=0 then 0 ELSE COALESCE(p_w.sum07/p_o.sum07,0) END AS rate_month_7
			,COALESCE(p_o.sum08,0) AS order_month_8
			,COALESCE(p_w.sum08,0) AS work_month_8
			, CASE WHEN COALESCE(p_o.sum08,0)=0 then 0 ELSE COALESCE(p_w.sum08/p_o.sum08,0) END AS rate_month_8
			,COALESCE(p_o.sum09,0) AS order_month_9
			,COALESCE(p_w.sum09,0) AS work_month_9
			, CASE WHEN COALESCE(p_o.sum09,0)=0 then 0 ELSE COALESCE(p_w.sum09/p_o.sum09,0) END AS rate_month_9
			,COALESCE(p_o.sum10,0) AS order_month_10
			,COALESCE(p_w.sum10,0) AS work_month_10
			, CASE WHEN COALESCE(p_o.sum10,0)=0 then 0 ELSE COALESCE(p_w.sum10/p_o.sum10,0) END AS rate_month_10
			,COALESCE(p_o.sum11,0) AS order_month_11
			,COALESCE(p_w.sum11,0) AS work_month_11
			, CASE WHEN COALESCE(p_o.sum11,0)=0 then 0 ELSE COALESCE(p_w.sum11/p_o.sum11,0) END AS rate_month_11
			,COALESCE(p_o.sum12,0) AS order_month_12
			,COALESCE(p_w.sum12,0) AS work_month_12
			, CASE WHEN COALESCE(p_o.sum12,0)=0 then 0 ELSE COALESCE(p_w.sum12/p_o.sum12,0) END AS rate_month_12
    FROM std_proc_tb s_p
    LEFT JOIN temp_order p_o ON p_o.proc_id = s_p.proc_id
		LEFT JOIN temp_work p_w ON p_w.proc_id = s_p.proc_id 
    ORDER BY s_p.proc_id ;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
    DROP TABLE temp_order;
		DROP TABLE temp_work;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 임시테이블 생성
    ${createOrderTempTable}
		${createWorkTempTable}

    -- 임시테이블 데이터 insert
    ${insertToOrderTempTable}
		${insertToWorkTempTable}

    -- Filtering 되어있는 정보에 추가 테이블 Join 하여 조회
    ${readQuery}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readWorkPlanAchievementRate }