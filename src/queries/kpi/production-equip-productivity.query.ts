const readEquipProductivity = (
  params: {
    start_date: string,
    end_date: string,
    workings_uuid?: string[]
  }) => {
	let searchQuery: string = '';

  //#region 📌 보유 설비 임시테이블 생성
  const createEquipTempTable = `
		CREATE TEMP TABLE temp_equip(
			workings_id int,
			holding_equip_cnt int
		);
		CREATE INDEX ON temp_equip(workings_id);
  `;
  //#endregion

	//#region 📌 가동 설비 임시테이블 생성
  const createWorkEquipTempTable = `
		CREATE TEMP TABLE temp_work_equip(
			workings_id int,
			work_equip_cnt int,
			work_min numeric(19,6) 
		);
		CREATE INDEX ON temp_work_equip(workings_id);
  `;
  //#endregion

	
  //#region 📌 가동 설비 데이터 삽입
  const insertToEquipTempTable = `
		INSERT INTO temp_equip
		SELECT 
			workings_id, 
			count(workings_id) cnt 
		FROM std_equip_tb 
		WHERE workings_id IS NOT NULL GROUP BY workings_id;
  `;
  //#endregion

  //#region 📌 임시테이블 데이터 삽입
  const insertToWorkEquipTempTable = `
		INSERT INTO temp_work_equip
		SELECT 
			workings_id, 
			count(workings_id) cnt, 
			sum(p_wr.work_min) work_min
		FROM (
			SELECT p_wr.equip_id, SUM(DATE_PART('hour', end_date - start_date) * 60 + DATE_PART('minute', end_date - start_date )) work_min
			FROM prd_work_routing_tb p_wr 
			WHERE p_wr.start_date BETWEEN '${params.start_date}' AND '${params.end_date}'
			AND p_wr.equip_id IS NOT NULL 
			GROUP BY p_wr.equip_id 
		)p_wr 
		JOIN std_equip_tb s_e ON s_e.workings_id IS NOT NULL AND s_e.equip_id = p_wr.equip_id
		GROUP BY workings_id;
  `;
  //#endregion

	//#region 📌 searchQuery
	if (params.workings_uuid) { 
		const workingsUuid = params.workings_uuid.map(uuid => {
			return `'${uuid}'`
		});
		searchQuery += ` AND s_w.uuid IN (${workingsUuid})`;
	}  
	if (searchQuery.length > 0) {
		searchQuery = searchQuery.substring(4, searchQuery.length);
		searchQuery = 'WHERE' + searchQuery;
	}
	//#endregion
	
  //#region 📌 추가 테이블 Join 및 조회
  const readEquipProductivityQuery = `
		SELECT 
			s_w.workings_nm AS workings_nm,
			s_w.workings_cd AS workings_cd,
			CASE WHEN coalesce(t_e.holding_equip_cnt, 0) = 0 THEN 0 ELSE CAST(COALESCE(t_we.work_equip_cnt, 0) AS decimal) / holding_equip_cnt  END AS equip_operation_rate, --설비 운영율
			CASE WHEN coalesce(t_we.work_equip_cnt, 0) = 0 THEN 0 ELSE CAST(COALESCE(t_we.work_min, 0) AS decimal) / (t_we.work_equip_cnt * 8) END AS equip_work_rate -- 설비 가동율
		FROM std_workings_tb s_w 
		LEFT JOIN temp_equip t_e ON t_e.workings_id = s_w.workings_id 
		LEFT JOIN temp_work_equip t_we ON t_we.workings_id = s_w.workings_id
		${searchQuery}
		ORDER BY s_w.workings_nm;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
		DROP TABLE temp_equip;
		DROP TABLE temp_work_equip;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 임시테이블 생성
    ${createEquipTempTable}
		${createWorkEquipTempTable}

    -- 데이터 임시테이블로 삽입
    ${insertToEquipTempTable}
		${insertToWorkEquipTempTable}

    -- Filtering 되어있는 정보에 추가 테이블 Join 하여 조회
    ${readEquipProductivityQuery}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readEquipProductivity }