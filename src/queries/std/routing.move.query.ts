const readRoutingMove = (
  params: {
    factory_id : number,
    prod_id : number,
    equip_id : number,
  }) => {
    let searchQuery: string = '';
    if (params.factory_id) { searchQuery += ` AND s_r.factory_id = '${params.factory_id}'`; }
    if (params.prod_id) { searchQuery += ` AND s_r.prod_id = '${params.prod_id}'`; }

    if (searchQuery.length > 0) {
      searchQuery = searchQuery.substring(4, searchQuery.length);
      searchQuery = 'WHERE' + searchQuery;
    }

    /** 임시테이블 저장 쿼리 셋팅 */
    const querysToInsertingTempTable = `
      INSERT INTO temp_routing(routing_id, factory_id, proc_id, proc_no, prod_id, equip_id, auto_work_fg)
      SELECT s_r.routing_id, s_r.factory_id, s_r.proc_id, s_r.proc_no, s_r.prod_id, (case when s_r.proc_rank = 1 then ${params.equip_id} end)::int, s_r.auto_work_fg
      FROM (	SELECT *, RANK() OVER(PARTITION BY s_r.factory_id, s_r.prod_id ORDER BY s_r.proc_no DESC) AS proc_rank
          FROM std_routing_tb s_r) s_r
      LEFT JOIN std_factory_tb s_f ON s_f.factory_id = s_r.factory_id   
      LEFT JOIN std_prod_tb s_p ON s_p.prod_id = s_r.prod_id
      ${searchQuery};
    `;

    const query = `

      /** ✅ 라우팅 정보 담을 임시테이블 */
      CREATE TEMP TABLE temp_routing(routing_id int, factory_id int, proc_id int, proc_no int, prod_id int, equip_id int, auto_work_fg boolean);
      CREATE INDEX ON temp_routing(prod_id);

      /** ✅ 조회조건에 따라 임시테이블 저장 */
      ${querysToInsertingTempTable}


      /** ✅ 결과조회 */
      SELECT 
        t_r.routing_id,
        t_r.factory_id, 
        s_f.factory_cd,
        s_f.factory_nm,
        t_r.proc_no,
        t_r.proc_id, 
        s_pc.proc_cd,
        s_pc.proc_nm, 
        t_r.prod_id, 
        s_p.prod_no,
        s_p.prod_nm,
        t_r.equip_id,
        s_p.item_type_id,
        s_it.item_type_cd,
        s_it.item_type_nm,
        s_p.prod_type_id,
        s_pt.prod_type_cd,
        s_pt.prod_type_nm,
        s_p.model_id,
        s_m.model_cd,
        s_m.model_nm,
        s_p.rev,
        s_p.prod_std,
        s_p.unit_id,
        s_u.unit_cd,
        s_u.unit_nm,
        t_r.auto_work_fg
      FROM temp_routing t_r 
      JOIN std_factory_tb s_f ON s_f.factory_id = t_r.factory_id
      JOIN std_proc_tb s_pc ON s_pc.proc_id = t_r.proc_id
      LEFT JOIN std_equip_tb s_e ON s_e.equip_id = t_r.equip_id
      JOIN std_prod_tb s_p ON s_p.prod_id = t_r.prod_id
      LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
      LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
      LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
      LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
      ORDER BY t_r.prod_id;


      /** ✅ 임시테이블 삭제 */
      DROP TABLE temp_routing;	
    `;

    return query;
  }

export { readRoutingMove }