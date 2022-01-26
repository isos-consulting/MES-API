const readWorkRejectsByWork = (
  params: {
    work_uuid?: string,
    work_routing_uuid?: string
  }) => {
    //#region 📌 실적별 공정 부적합을 조회하기 위한 임시테이블 생성
    const createTempTable = `
      DO $$

      DECLARE workId int;
      DECLARE workRoutingId int;
      DECLARE procId int;
      
      BEGIN
        
      SELECT work_id INTO workId
      FROM prd_work_tb WHERE uuid = '${params.work_uuid}';
      
      SELECT work_routing_id, proc_id INTO workRoutingId, procId
      FROM prd_work_routing_tb 
      WHERE uuid = '${params.work_routing_uuid}';
      
      CREATE TEMP TABLE temp_reject (
        factory_id int,
        uuid uuid,
        work_reject_id int,
        work_id int,
        work_routing_id int,
        reject_id int,
        reject_type_id int,
        qty numeric(19, 6),
        to_store_id int,
        to_location_id int,
        remark varchar(250)
      );
      
      INSERT INTO temp_reject
      SELECT 
        s_pr.factory_id, 
        p_wr.uuid,
        p_wr.work_reject_id, 
        COALESCE(p_wr.work_id, workId), 
        COALESCE(p_wr.work_routing_id, workRoutingId), 
        s_pr.reject_id, 
        s_rt.reject_type_id,
        p_wr.qty,
        p_wr.to_store_id,
        p_wr.to_location_id,
        p_wr.remark
      FROM std_proc_reject_tb s_pr
      LEFT JOIN prd_work_reject_tb p_wr ON p_wr.reject_id = s_pr.reject_id 
                      AND p_wr.work_id = workId AND p_wr.work_routing_id = workRoutingId
      JOIN std_reject_tb s_r ON s_r.reject_id = s_pr.reject_id 
      LEFT JOIN std_reject_type_tb s_rt ON s_rt.reject_type_id = s_r.reject_type_id 
      WHERE proc_id = ProcId;
      
      END $$;
    `;
    //#endregion

    //#region 📌 실적의 공정에 해당하는 기준 부적합 정보 및 실적에 등록되어있는 부적합 정보 조회
    const readQuery = `
      SELECT 
        t_r.uuid AS work_reject_uuid,
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
        t_r.qty,
        s_s.uuid AS to_store_uuid,
        s_s.store_cd AS to_store_cd,
        s_s.store_nm AS to_store_nm,
        s_l.uuid AS to_location_uuid,
        s_l.location_cd AS to_location_cd,
        s_l.location_nm AS to_location_nm,
        t_r.remark
      FROM temp_reject t_r
      JOIN std_reject_tb s_r ON s_r.reject_id = t_r.reject_id
      LEFT JOIN std_reject_type_tb s_rt ON s_rt.reject_type_id = s_r.reject_type_id
      LEFT JOIN std_store_tb s_s ON s_s.store_id = t_r.to_store_id
      LEFT JOIN std_location_tb s_l ON s_l.location_id = t_r.to_location_id
      LEFT JOIN prd_work_routing_tb p_wro ON p_wro.work_routing_id = t_r.work_routing_id
      LEFT JOIN std_proc_tb s_p ON s_p.proc_id = p_wro.proc_id
      LEFT JOIN std_workings_tb s_w ON s_w.workings_id = p_wro.workings_id
      LEFT JOIN std_equip_tb s_e ON s_e.equip_id = p_wro.equip_id
      LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_r.factory_id
      LEFT JOIN prd_work_tb p_w ON p_w.work_id = t_r.work_id;
    `;
    //#endregion
  
    //#region 📌 임시테이블 Drop
    const dropTempTableQuery = `
      DROP TABLE temp_reject;
    `;
    //#endregion
  
    //#region 📒 Main Query
    const query = `
      -- 실적별 공정 부적합을 조회하기 위한 임시테이블 생성
      ${createTempTable}

      -- 실적의 공정에 해당하는 기준 부적합 정보 및 실적에 등록되어있는 부적합 정보 조회
      ${readQuery}

      -- 임시테이블 Drop
      ${dropTempTableQuery}
    `;
    //#endregion
  
    return query;
}

export { readWorkRejectsByWork }