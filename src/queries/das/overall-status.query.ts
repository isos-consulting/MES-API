// 📌 일별 매입,매출 금액
const readPurchasedSalesByDay = (
  params: {
    start_date?: string,
    end_date?: string,
  }) => {
  let searchQuery: string = '';

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

	//#region 📌 임시테이블 생성
  const createTempTable = `
		CREATE TEMP TABLE temp_price(price_type TEXT, reg_date varchar, price numeric);
  `;
  //#endregion

	//#region 📌 데이터 저장
  const insertTempTable = `
		/** 매입금액 산출 */
		INSERT INTO temp_price
		SELECT 'purchase' AS price_type, m_r.reg_date, sum(COALESCE(m_rd.total_price,0)) AS price
		FROM mat_receive_detail_tb m_rd 
		JOIN mat_receive_tb m_r ON m_r.receive_id = m_rd.receive_id
		WHERE m_r.reg_date::date BETWEEN '${params.start_date}' AND '${params.end_date}'
		GROUP BY m_r.reg_date;

		/** 매출금액 산출 */
		INSERT INTO temp_price
		SELECT 'sales' AS price_type, s_o.reg_date, sum(COALESCE(s_od.total_price,0)) AS price
		FROM sal_outgo_detail_tb s_od 
		JOIN sal_outgo_tb s_o ON s_o.outgo_id = s_od.outgo_id
		WHERE s_o.reg_date::date BETWEEN '${params.start_date}' AND '${params.end_date}'
		GROUP BY s_o.reg_date;
  `;
  //#endregion

  //#region 📌 조회
  const read = `
		SELECT * FROM temp_price ORDER BY price_type, reg_date;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  const dropTempTable = `
		DROP TABLE temp_price;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
		/** 임시테이블 생성 */
    ${createTempTable}

    ${insertTempTable}

    /** 결과 */
    ${read}

    /** 임시테이블 삭제 */
    ${dropTempTable}
  `;
  //#endregion

  return query;
}

// 📌 월별 매입,매출 금액
const readPurchasedSalesByMonth = (
  params: {
    year?: string,
  }) => {
  let searchQuery: string = '';

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

	//#region 📌 임시테이블 생성
  const createTempTable = `
		CREATE TEMP TABLE temp_price(price_type TEXT, reg_date integer, price numeric);
  `;
  //#endregion

	//#region 📌 데이터 저장
  const insertTempTable = `
		/** 매입금액 산출 */
		INSERT INTO temp_price
		SELECT 'purchase' AS price_type, to_char(m_r.reg_date, 'MM')::integer, sum(COALESCE(m_rd.total_price,0)) AS price
		FROM mat_receive_detail_tb m_rd 
		JOIN mat_receive_tb m_r ON m_r.receive_id = m_rd.receive_id
		WHERE to_char(m_r.reg_date, 'YYYY') = '${params.year}'
		GROUP BY to_char(m_r.reg_date, 'MM');

		/** 매출금액 산출 */
		INSERT INTO temp_price
		SELECT 'sales' AS price_type, to_char(s_o.reg_date, 'MM')::integer, sum(COALESCE(s_od.total_price,0)) AS price
		FROM sal_outgo_detail_tb s_od 
		JOIN sal_outgo_tb s_o ON s_o.outgo_id = s_od.outgo_id
		WHERE to_char(s_o.reg_date, 'YYYY') = '${params.year}'
		GROUP BY to_char(s_o.reg_date, 'MM');
  `;
  //#endregion

  //#region 📌 조회
  const read = `
		SELECT * FROM temp_price ORDER BY price_type, reg_date;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  const dropTempTable = `
		DROP TABLE temp_price;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
		/** 임시테이블 생성 */
    ${createTempTable}

    ${insertTempTable}

    /** 결과 */
    ${read}

    /** 임시테이블 삭제 */
    ${dropTempTable}
  `;
  //#endregion

  return query;
}

// 📌 연도별 매입,매출 금액
const readPurchasedSalesByYear = (
  params: {
    start_year?: number,
    end_year?: number,
  }) => {
  let searchQuery: string = '';

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

	//#region 📌 임시테이블 생성
  const createTempTable = `
		CREATE TEMP TABLE temp_price(price_type TEXT, reg_date text, price numeric);
  `;
  //#endregion

	//#region 📌 데이터 저장
  const insertTempTable = `
		/** 매입금액 산출 */
		INSERT INTO temp_price
		SELECT 'purchase' AS price_type, to_char(m_r.reg_date, 'YYYY'), sum(COALESCE(m_rd.total_price,0)) AS price
		FROM mat_receive_detail_tb m_rd 
		JOIN mat_receive_tb m_r ON m_r.receive_id = m_rd.receive_id
		WHERE to_char(m_r.reg_date, 'YYYY')::integer BETWEEN ${params.start_year} AND ${params.end_year}
		GROUP BY to_char(m_r.reg_date, 'YYYY');

		/** 매출금액 산출 */
		INSERT INTO temp_price
		SELECT 'sales' AS price_type, to_char(s_o.reg_date, 'YYYY'), sum(COALESCE(s_od.total_price,0)) AS price
		FROM sal_outgo_detail_tb s_od 
		JOIN sal_outgo_tb s_o ON s_o.outgo_id = s_od.outgo_id
		WHERE to_char(s_o.reg_date, 'YYYY')::integer BETWEEN ${params.start_year} AND ${params.end_year}
		GROUP BY to_char(s_o.reg_date, 'YYYY');
  `;
  //#endregion

  //#region 📌 조회
  const read = `
		SELECT * FROM temp_price ORDER BY price_type, reg_date;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  const dropTempTable = `
		DROP TABLE temp_price;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
		/** 임시테이블 생성 */
    ${createTempTable}

    ${insertTempTable}

    /** 결과 */
    ${read}

    /** 임시테이블 삭제 */
    ${dropTempTable}
  `;
  //#endregion

  return query;
}

export { readPurchasedSalesByDay, readPurchasedSalesByMonth, readPurchasedSalesByYear }