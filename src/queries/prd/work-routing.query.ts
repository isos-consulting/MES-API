const readWorkRoutings = (
  params: {
    factory_uuid?: string,
    work_uuid?: string,
    uuid?: string
  }) => {
  let searchQuery: string = '';

  if (params.work_uuid) { searchQuery += ` AND p_w.uuid = '${params.work_uuid}'`; }
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.uuid) { searchQuery += ` AND p_wr.uuid = '${params.uuid}'`; }
  
  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const createTempTable = `
    -- [[ 공정순서 별 작업자 리스트 조회 임시테이블 생성 ]]
    CREATE TEMP TABLE temp_worker_tb(work_routing_id int, worker_nm text);
    CREATE INDEX ON temp_worker_tb(work_routing_id);

    INSERT INTO temp_worker_tb
    SELECT 	p_ww.work_routing_id, 
        CASE WHEN count(p_ww.worker_id) = 1 THEN max(s_w.worker_nm) 
        ELSE max(s_w.worker_nm) || '외 ' || count(p_ww.worker_id) || '명' END AS worker_nm
    FROM prd_work_worker_tb p_ww
    JOIN std_worker_tb s_w ON s_w.worker_id = p_ww.worker_id 
    GROUP BY p_ww.work_routing_id ;
    

    -- [[ 공정순서 별 부적합 수량 조회 임시테이블 생성 ]]
    CREATE TEMP TABLE temp_reject_tb(work_routing_id int, reject_qty numeric);
    CREATE INDEX ON temp_reject_tb(work_routing_id);

    INSERT INTO temp_reject_tb
    SELECT work_routing_id, sum(qty) AS qty
    FROM prd_work_reject_tb
    GROUP BY work_routing_id;
  `;

  //#region 📒 Main Query
  const createQuery = `
    SELECT
      p_wr.work_routing_id,
      p_wr.work_id,
      s_f.uuid AS factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      s_w.uuid AS workings_uuid,
      s_w.workings_cd,
      s_w.workings_nm,
      s_pc.uuid AS proc_uuid,
      s_pc.proc_cd,
      s_pc.proc_nm,
      p_wr.proc_no,
      s_e.uuid AS equip_uuid,
      s_e.equip_cd,
      s_e.equip_nm,
      m_m.uuid AS mold_uuid,
      m_m.mold_cd,
      m_m.mold_nm,
      p_wr.mold_cavity,
      COALESCE(p_wr.qty,0) + COALESCE(t_r.reject_qty,0) AS total_qty,
      COALESCE(p_wr.qty,0) AS qty,
      COALESCE(t_r.reject_qty,0) AS reject_qty,
      p_wr.start_date,
      p_wr.end_date,
      p_wr.work_time,
      p_wr.ongoing_fg,
      t_w.worker_nm,
      p_wr.remark,
      p_wr.created_at,
      p_wr.created_uid,
      a_uc.user_nm as created_nm,
      p_wr.updated_at,
      p_wr.updated_uid,
      a_uu.user_nm as updated_nm,
      p_wr.uuid
    FROM prd_work_routing_tb p_wr
    JOIN prd_work_tb p_w ON p_w.work_id = p_wr.work_id 
    JOIN std_factory_tb s_f ON s_f.factory_id = p_wr.factory_id 
    JOIN std_workings_tb s_w ON s_w.workings_id = p_wr.workings_id 
    JOIN std_proc_tb s_pc ON s_pc.proc_id = p_wr.proc_id 
    LEFT JOIN std_equip_tb s_e ON s_e.equip_id = p_wr.equip_id
    LEFT JOIN mld_mold_tb m_m ON m_m.mold_id = p_wr.mold_id
    LEFT JOIN temp_worker_tb t_w ON t_w.work_routing_id = p_wr.work_routing_id 
    LEFT JOIN temp_reject_tb t_r ON t_r.work_routing_id = p_wr.work_routing_id 
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_wr.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_wr.updated_uid
    ${searchQuery}
    ORDER BY p_wr.proc_no;
  `;

  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTable = `
    DROP TABLE temp_worker_tb;
    DROP TABLE temp_reject_tb;
  `;

  const query = `
    -- 실적-공정순서 정보를 가져오기 전 작업자, 불량수량에 대한 데이터 셋팅
    ${createTempTable}
    
    -- 작업실적 메인 조회 쿼리
    ${createQuery}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTable}
  `;
  //#endregion

  return query;
}

export { readWorkRoutings }