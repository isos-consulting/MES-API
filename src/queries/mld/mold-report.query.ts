const readMoldReport = (
  params: {
    reg_date?: string,
    use_fg?: boolean
  }) => {
  //#region 📌 생산실적의 특정 일자 기준 금형의 사용량 조회
  const createWorkTempTable = `
    CREATE TEMP TABLE temp_work (
      mold_id int,				-- 금형ID
      work_cnt int,				-- 생산 타수
      work_qty int				-- 생산 수량
    );
    CREATE INDEX idx_temp_work ON temp_work(mold_id);
    
    
    INSERT INTO temp_work
    SELECT 
      mold_id,
      SUM((qty + reject_qty) / mold_cavity) AS work_cnt,
      SUM((qty + reject_qty)) AS work_qty
    FROM prd_work_tb p_w
    WHERE date(start_date) <= '${params.reg_date}'
    AND COALESCE(mold_cavity, 0) <> 0
    AND mold_id IS NOT NULL
    GROUP BY mold_id;
  `;
  //#endregion

  //#region 📌 금형타수현황 조회
  const readMold = `
    SELECT 
      m_m.uuid AS mold_uuid,
      m_m.mold_cd,
      m_m.mold_nm,
      m_m.mold_no,
      m_m.cavity,																					                                              -- A (기준 Cavity)
      m_m.guarantee_cnt,																	                                              -- B (보증 타수)
      m_m.basic_cnt, 																			                                              -- C (기초 타수)
      p_w.work_cnt,																				                                              -- D (생산 타수)
      m_m.basic_cnt * p_w.work_cnt AS accumulated_cnt,		                                              -- E (누적 생산타수) [C + D]
      m_m.guarantee_cnt - (p_w.work_cnt + m_m.basic_cnt) AS remained_cnt,                               -- F (잔여 타수) [B - E]
      m_m.cavity * m_m.guarantee_cnt AS guarantee_qty,											                            -- G (보증 수량) [A * B]
      m_m.basic_cnt * m_m.cavity AS basic_qty, 												                                  -- H (기초 수량) [A * C]
      p_w.work_qty,																				                                              -- I (생산 수량)
      (m_m.cavity * m_m.guarantee_cnt) - ((m_m.basic_cnt * m_m.cavity) + p_w.work_qty) AS remained_qty, -- J (잔여 수량) [G - (H + I)]
      ((m_m.basic_cnt * m_m.cavity) + p_w.work_qty) / (m_m.cavity * m_m.guarantee_cnt) AS mold_rate 		-- K (타수율) [(H + I) / G]
    FROM mld_mold_tb m_m
    JOIN temp_work p_w ON p_w.mold_id = m_m.mold_id
    WHERE (m_m.cavity * m_m.guarantee_cnt) <> 0
    ${params.use_fg != null ? `AND m_m.use_fg = ${params.use_fg}` : ''};
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTable = `
    DROP TABLE temp_work;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 생산실적의 특정 일자 기준 금형의 사용량 조회
    ${createWorkTempTable}

    -- 금형타수현황 조회
    ${readMold}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTable}
  `;
  //#endregion

  return query;
}

export { readMoldReport }