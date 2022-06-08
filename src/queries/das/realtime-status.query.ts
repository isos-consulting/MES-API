// 📌 설비 가동율
const readFacilityOperationRate = () => {
  let searchQuery: string = '';

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

	//#region 📌 임시테이블 생성
  const createTempTable = `
    CREATE TEMP TABLE temp_result(std_equip_cnt NUMERIC(19,2), prd_equip_cnt NUMERIC(19,2));
  `;
  //#endregion

	//#region 📌 데이터 저장
  const insertTempTable = `
    /** 기준 설비 갯수 가져오기 */
    SELECT count(*) INTO std_equip_cnt
    FROM std_equip_tb 
    WHERE use_fg = TRUE AND prd_fg = TRUE;
    
    /** 생산중인 설비 갯수 가져오기 */
    SELECT count(DISTINCT p_wr.equip_id) INTO prd_equip_cnt
    FROM prd_work_routing_tb p_wr 
    JOIN prd_work_tb p_w ON p_w.work_id = p_wr.work_id AND p_w.complete_fg = FALSE
    WHERE p_wr.equip_id IS NOT NULL;

    INSERT INTO temp_result VALUES (std_equip_cnt, prd_equip_cnt);
  `;
  //#endregion

  //#region 📌 조회
  const read = `
    SELECT 
      COALESCE(std_equip_cnt,0) AS std_equip_cnt, 
      COALESCE(prd_equip_cnt,0) AS prd_equip_cnt,
      CASE WHEN COALESCE(std_equip_cnt,0) = 0 THEN 0
      ELSE ((COALESCE(prd_equip_cnt,0)/COALESCE(std_equip_cnt,0)) * 100)::integer END AS rate
    FROM temp_result;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  const dropTempTable = `
    DROP TABLE temp_result;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    DO $$
    DECLARE
      std_equip_cnt integer:= 0;
      prd_equip_cnt integer:= 0;

    BEGIN
      /** 임시테이블 생성 */
      ${createTempTable}

      ${insertTempTable}

    END $$;

    /** 
     * 결과
     * 달성율(rate): 생산중인 설비 수 / 기준 설비 수
     *  */
		${read}

    /** 임시테이블 삭제 */
    ${dropTempTable}
  `;
  //#endregion

  return query;
}

// 📌 불량율
const readRejectRate = (
  params: {
    reg_date: string
  }
) => {
  let searchQuery: string = '';

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

	//#region 📌 임시테이블 생성
  const createTempTable = `
    CREATE TEMP TABLE temp_result(qty NUMERIC(19,2), reject_qty NUMERIC(19,2));
  `;
  //#endregion

	//#region 📌 데이터 저장
  const insertTempTable = `
    /** 양품수량 가져오기 */
    SELECT sum(COALESCE(p_wr.qty,0)) INTO qty
    FROM prd_work_routing_tb p_wr 
    JOIN prd_work_tb p_w ON p_w.work_id = p_wr.work_id 
    WHERE p_w.reg_date::date = '${params.reg_date}';
    
    /** 불량수량 가져오기 */
    SELECT sum(COALESCE(p_wr.qty,0)) INTO reject_qty 
    FROM prd_work_reject_tb p_wr 
    JOIN prd_work_tb p_w ON p_w.work_id = p_wr.work_id 
    WHERE p_w.reg_date::date = '${params.reg_date}';

    INSERT INTO temp_result VALUES (qty, reject_qty);
  `;
  //#endregion

  //#region 📌 조회
  const read = `
    SELECT 
      COALESCE(qty,0) AS qty, 
      COALESCE(reject_qty,0) AS reject_qty,
      CASE WHEN (COALESCE(qty,0)+COALESCE(reject_qty,0)) = 0 THEN 0
      ELSE ((COALESCE(reject_qty,0)/(COALESCE(qty,0)+COALESCE(reject_qty,0))) * 100)::integer END AS rate
    FROM temp_result;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  const dropTempTable = `
    DROP TABLE temp_result;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    DO $$
    DECLARE
      qty numeric:= 0;
      reject_qty numeric:= 0;

    BEGIN
      /** 임시테이블 생성 */
      ${createTempTable}

      ${insertTempTable}

    END $$;

    /** 결과 */
		${read}

    /** 임시테이블 삭제 */
    ${dropTempTable}
  `;
  //#endregion

  return query;
}

// 📌 생산 진척율
const readPrdProgressRate = (
  params: {
    reg_date: string,
  }
) => {
  let searchQuery: string = '';

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

	//#region 📌 임시테이블 생성
  const createTempTable = `
    CREATE TEMP TABLE temp_result(order_qty NUMERIC(19,2), work_qty NUMERIC(19,2));
  `;
  //#endregion

	//#region 📌 데이터 저장
  const insertTempTable = `
    /** 지시수량 가져오기 */
    SELECT sum(qty) INTO order_qty 
    FROM prd_order_tb
    WHERE reg_date::date = '${params.reg_date}';
    
    /** 생산수량 가져오기 */
    WITH work_routing AS
    (
      SELECT 
        p_wr.factory_id, p_wr.work_id, p_wr.work_routing_id, COALESCE(p_wr.qty,0) as qty,
        rank() over(PARTITION BY p_wr.factory_id, p_wr.work_id ORDER BY p_wr.proc_no DESC) AS rn
      FROM prd_work_routing_tb p_wr
      JOIN prd_work_tb p_w ON p_w.work_id = p_wr.work_id 
      WHERE p_w.reg_date::date = '${params.reg_date}'
    )
    SELECT sum(COALESCE(qty,0)) INTO work_qty
    FROM work_routing 
    WHERE rn = 1;

    INSERT INTO temp_result VALUES (order_qty, work_qty);
  `;
  //#endregion

  //#region 📌 조회
  const read = `
    SELECT 
      COALESCE(order_qty,0) AS order_qty, 
      COALESCE(work_qty,0) AS work_qty,
      CASE WHEN COALESCE(order_qty,0) = 0 THEN 0
      ELSE ((COALESCE(work_qty,0)/COALESCE(order_qty,0)) * 100)::integer END AS rate
    FROM temp_result;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  const dropTempTable = `
    DROP TABLE temp_result;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    DO $$
    DECLARE
      order_qty numeric:= 0;
      work_qty numeric:= 0;

    BEGIN
      /** 임시테이블 생성 */
      ${createTempTable}

      ${insertTempTable}

    END $$;

    /** 
     * 결과
     * 달성율(rate): 생산중인 설비 수 / 기준 설비 수
     *  */
		${read}

    /** 임시테이블 삭제 */
    ${dropTempTable}
  `;
  //#endregion

  return query;
}


export { readFacilityOperationRate, readRejectRate, readPrdProgressRate }