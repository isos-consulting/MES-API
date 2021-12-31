const readWorkRejectsByWork = (
  params: {
    work_uuid?: string
  }) => {
    //#region 📌 실적 UUID에 해당하는 실적 데이터를 담은 임시테이블 생성
    const createWorkTempTable = `
      SELECT * INTO temp_work
      FROM prd_work_tb p_w
      WHERE p_w.uuid = '${params.work_uuid}';
      
      CREATE INDEX idx_temp_work ON temp_work(work_id);
    `;
    //#endregion

    //#region 📌 실적에 등록되어있는 실적 부적합 정보를 가진 임시테이블 생성
    const createWorkRejectTempTable = `
      SELECT p_wr.* INTO temp_work_reject
      FROM prd_work_reject_tb p_wr
      JOIN temp_work t_w ON t_w.work_id = p_wr.work_id;
      
      CREATE INDEX idx_temp_work_reject ON temp_work_reject(work_id, reject_id);
    `;
    //#endregion

    //#region 📌 실적 데이터의 공정에 해당하는 기준 부적합 정보와 실적 부적합에 등록되어있는 부적합ID를 가진 임시테이블 생성
    const createRejectTempTable = `
      CREATE TEMP TABLE temp_reject (reject_id int4 NOT NULL);
      CREATE INDEX idx_temp_reject ON temp_reject(reject_id);
      
      INSERT INTO temp_reject (reject_id)
      SELECT reject_id 
      FROM std_proc_reject_tb s_pr
      JOIN temp_work t_w ON t_w.proc_id = s_pr.proc_id
      
      UNION
      
      SELECT reject_id FROM temp_work_reject;
    `;
    //#endregion

    //#region 📌 실적의 공정에 해당하는 기준 부적합 정보 및 실적에 등록되어있는 부적합 정보 조회
    const readQuery = `
      SELECT 
        p_wr.uuid AS work_reject_uuid,
        s_f.uuid AS factory_uuid,
        s_f.factory_cd,
        s_f.factory_nm,
        p_w.uuid AS work_uuid,
        p_wro.uuid AS work_routing_uuid,
        p_wro.proc_no,
        s_p.uuid AS proc_uuid,
        s_p.proc_cd,
        s_p.proc_nm,
        s_w.uuid AS workings_uuid,
        s_w.workings_cd,
        s_w.workings_nm,
        s_e.uuid AS equip_uuid,
        s_e.equip_cd,
        s_e.equip_nm,
        s_r.uuid AS reject_uuid,
        s_r.reject_cd,
        s_r.reject_nm,
        s_rt.uuid AS reject_type_uuid,
        s_rt.reject_type_cd,
        s_rt.reject_type_nm,
        p_wr.qty,
        s_s.uuid AS to_store_uuid,
        s_s.store_cd AS to_store_cd,
        s_s.store_nm AS to_store_nm,
        s_l.uuid AS to_location_uuid,
        s_l.location_cd AS to_location_cd,
        s_l.location_nm AS to_location_nm,
        p_wr.remark
      FROM temp_reject t_r
      JOIN std_reject_tb s_r ON s_r.reject_id = t_r.reject_id
      LEFT JOIN std_reject_type_tb s_rt ON s_rt.reject_type_id = s_r.reject_type_id
      LEFT JOIN temp_work_reject p_wr ON p_wr.reject_id = t_r.reject_id
      LEFT JOIN std_store_tb s_s ON s_s.store_id = p_wr.to_store_id
      LEFT JOIN std_location_tb s_l ON s_l.location_id = p_wr.to_location_id
      LEFT JOIN prd_work_routing_tb p_wro ON p_wro.work_routing_id = p_wr.work_routing_id
      LEFT JOIN std_proc_tb s_p ON s_p.proc_id = p_wro.proc_id
      LEFT JOIN std_workings_tb s_w ON s_w.workings_id = p_wro.workings_id
      LEFT JOIN std_equip_tb s_e ON s_e.equip_id = p_wro.equip_id
      LEFT JOIN std_factory_tb s_f ON s_f.factory_id = p_wr.factory_id
      LEFT JOIN temp_work p_w ON p_w.work_id = p_wr.work_id;
    `;
    //#endregion
  
    //#region 📌 임시테이블 Drop
    const dropTempTableQuery = `
      DROP TABLE temp_work;
      DROP TABLE temp_work_reject;
      DROP TABLE temp_reject;
    `;
    //#endregion
  
    //#region 📒 Main Query
    const query = `
      -- 실적 UUID에 해당하는 실적 데이터를 담은 임시테이블 생성
      ${createWorkTempTable}

      -- 실적에 등록되어있는 실적 부적합 정보를 가진 임시테이블 생성
      ${createWorkRejectTempTable}

      -- 실적 데이터의 공정에 해당하는 기준 부적합 정보와 실적 부적합에 등록되어있는 부적합ID를 가진 임시테이블 생성
      ${createRejectTempTable}

      -- 실적의 공정에 해당하는 기준 부적합 정보 및 실적에 등록되어있는 부적합 정보 조회
      ${readQuery}

      -- 임시테이블 Drop
      ${dropTempTableQuery}
    `;
    //#endregion
  
    return query;
}

export { readWorkRejectsByWork }