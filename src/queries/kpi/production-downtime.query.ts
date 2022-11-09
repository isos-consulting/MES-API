const readDowntime = (
  params: {
    start_date: string,
    end_date: string,
    workings_uuid?: string
  }) => {
	let searchQuery: string = '';

  //#region 📌 작업장별 비가동 시간 임시테이블 생성
  const createDowntimeTempTable = `
		CREATE TEMP TABLE temp_downtime(
			workings_id int,
			work_min numeric(19,6)
		);
		CREATE INDEX ON temp_downtime(workings_id);
  `;
  //#endregion

	
  //#region 📌 작업장별 비가동 시간 데이터 삽입
  const insertToDowntimeTempTable = `
		INSERT INTO temp_downtime
		SELECT  
			p_wr.workings_id,
			SUM(DATE_PART('hour', p_wd.end_date - p_wd.start_date) * 60 + DATE_PART('minute', p_wd.end_date - p_wd.start_date )) work_min
		FROM prd_work_downtime_tb p_wd
		JOIN prd_work_routing_tb p_wr ON p_wr.work_routing_id = p_wd.work_routing_id
		GROUP BY p_wr.workings_id;
  `;
  //#endregion

	//#region 📌 searchQuery
	if (params.workings_uuid) { searchQuery += ` AND s_w.uuid = '${params.workings_uuid}'`; }  
	if (searchQuery.length > 0) {
		searchQuery = searchQuery.substring(4, searchQuery.length);
		searchQuery = 'WHERE' + searchQuery;
	}
	//#endregion
	
  //#region 📌 추가 테이블 Join 및 조회
  const readDowntimeQuery = `
		
		SELECT 
			s_w.workings_cd ,
			s_w.workings_nm ,
			coalesce(t_d.work_min,0) AS work_min
		FROM std_workings_tb s_w
		LEFT JOIN temp_downtime t_d ON t_d.workings_id = s_w.workings_id;
		${searchQuery}
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
		DROP TABLE temp_downtime;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 임시테이블 생성
    ${createDowntimeTempTable}

    -- 데이터 임시테이블로 삽입
    ${insertToDowntimeTempTable}

    -- Filtering 되어있는 정보에 추가 테이블 Join 하여 조회
    ${readDowntimeQuery}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readDowntime }