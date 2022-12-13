const readRoutingPrdActive = (
  params: {
    factory_uuid : string,
    prod_uuid : string,
  }) => {
    let searchQuery: string = '';
    if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
    if (params.prod_uuid) { searchQuery += ` AND s_p.uuid = '${params.prod_uuid}'`; }

    /** 임시테이블 저장 쿼리 셋팅 */
    const querysToInsertingTempTable = `
      INSERT INTO temp_routing	
      SELECT s_r.routing_id, s_r.factory_id, s_r.proc_id, s_r.proc_no, s_r.prod_id, s_r.auto_work_fg, s_rw.workings_id
      FROM (	SELECT *, RANK() OVER(PARTITION BY s_r.factory_id, s_r.prod_id ORDER BY s_r.proc_no DESC) AS proc_rank
          FROM std_routing_tb s_r) s_r
      LEFT JOIN std_factory_tb s_f ON s_f.factory_id = s_r.factory_id
      JOIN std_routing_workings_tb s_rw ON s_rw.prod_id = s_r.prod_id AND s_rw.factory_id = s_f.factory_id
      LEFT JOIN std_prod_tb s_p ON s_p.prod_id = s_r.prod_id
      WHERE s_r.proc_rank = 1 AND s_p.use_fg = TRUE AND s_p.prd_active_fg = TRUE
      ${searchQuery};
    `;

    const query = `
      /** ✅ 라우팅 정보 담을 임시테이블 */
      CREATE TEMP TABLE temp_routing( routing_id int, factory_id int, proc_id int, proc_no int, prod_id int, auto_work_fg boolean, workings_id int );
      CREATE INDEX ON temp_routing(prod_id);

      /** ✅ 조회조건에 따라 임시테이블 저장 */
      ${querysToInsertingTempTable}

      /** ✅ 결과조회 */
      SELECT 
        s_r.uuid as routing_uuid,
        s_f.uuid as factory_uuid, 
        s_f.factory_cd,
        s_f.factory_nm,
        t_r.proc_no,
        s_pc.uuid as proc_uuid, 
        s_pc.proc_cd,
        s_pc.proc_nm, 
        s_w.uuid as workings_uuid,
        s_w.workings_cd,
        s_w.workings_nm,
        s_p.uuid as prod_uuid, 
        s_p.prod_no,
        s_p.prod_nm,
        s_it.uuid as item_type_uuid,
        s_it.item_type_cd,
        s_it.item_type_nm,
        s_pt.uuid as prod_type_uuid,
        s_pt.prod_type_cd,
        s_pt.prod_type_nm,
        s_m.uuid as model_uuid,
        s_m.model_cd,
        s_m.model_nm,
        s_p.rev,
        s_p.prod_std,
        s_u.uuid as unit_uuid,
        s_u.unit_cd,
        s_u.unit_nm,
        t_r.auto_work_fg 
      FROM temp_routing t_r 
      JOIN std_routing_tb s_r ON s_r.routing_id = t_r.routing_id
      JOIN std_factory_tb s_f ON s_f.factory_id = t_r.factory_id
      JOIN std_proc_tb s_pc ON s_pc.proc_id = t_r.proc_id
      JOIN std_prod_tb s_p ON s_p.prod_id = t_r.prod_id
      LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
      LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
      LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
      LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
      LEFT JOIN std_workings_tb s_w ON s_w.workings_id = t_r.workings_id
      ORDER BY t_r.prod_id;

      /** ✅ 임시테이블 삭제 */
      DROP TABLE temp_routing;	
    `;

    return query;
  }

export { readRoutingPrdActive }