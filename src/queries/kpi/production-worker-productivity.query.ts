const readWorkerProductivity = (params: {
    start_date: string,
    end_date: string
  }) => {
  //#region 📌 임시테이블 생성
  const createTempTable = `
    CREATE TEMP TABLE temp_work(
      workings_id int,
      proc_id int,
			qty numeric(19,6),
      work_min numeric(19,6)
    );
    CREATE INDEX ON temp_work(workings_id);
  `;
  //#endregion

  //#region 📌 임시테이블 데이터 삽입
  const insertToTempTable = `
    INSERT INTO temp_work
		SELECT 
			p_wr.workings_id ,
			p_wr.proc_id,
			SUM(COALESCE (p_wr.qty,0)) qty, 
			SUM(DATE_PART('hour', end_date - start_date) * 60 + DATE_PART('minute', end_date - start_date )) work_min
		FROM prd_work_routing_tb p_wr 
		WHERE p_wr.start_date BETWEEN '${params.start_date}' AND '${params.end_date}' AND p_wr.equip_id IS NOT NULL 
		GROUP BY p_wr.workings_id , p_wr.proc_id;
  `;
  //#endregion

  //#region 📌 추가 테이블 Join 및 조회
  // 📌 Filtering 되어있는 정보에 추가 테이블 Join 하여 조회
  const readHistory = `
	SELECT 
		s_w.workings_nm as workings_nm, 
		s_p.proc_nm AS proc_nm, 
		CASE WHEN coalesce(p_wr.work_min,0) = 0 THEN 0 ELSE p_wr.qty / p_wr.work_min END AS productivity
	FROM temp_work p_wr
	JOIN std_proc_tb s_p ON s_p.proc_id = p_wr.proc_id 
	JOIN std_workings_tb s_w ON s_w.workings_id = p_wr.workings_id 
	ORDER BY s_w.workings_nm, s_p.proc_nm;
	`;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
    DROP TABLE temp_work;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 임시테이블 생성
    ${createTempTable}

    -- 데이터 임시테이블로 삽입
    ${insertToTempTable}

    -- Filtering 되어있는 정보에 추가 테이블 Join 하여 조회
    ${readHistory}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readWorkerProductivity }