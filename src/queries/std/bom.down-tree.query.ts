const readToProdOfDownTrees = (factoryUuid?: string, prodUuid?: string) => {

  const createTempTable = `
    -- ✅ 품목을 선택하여 BOM Tree를 조회할 경우를 위하여 임시테이블 생성
    CREATE TEMP TABLE temp_bom_tree_vw (
      lv int,
      factory_id int,
      bom_id int,
      p_prod_id int,
      prod_id int,
      c_usage numeric(19,6),
      t_usage numeric(19,6),
      sortby text
    );
    CREATE INDEX ON temp_bom_tree_vw(bom_id);
    CREATE INDEX ON temp_bom_tree_vw(p_prod_id);
    CREATE INDEX ON temp_bom_tree_vw(prod_id);
    CREATE INDEX ON temp_bom_tree_vw(sortby);
  
    WITH RECURSIVE bom_cte(lv, factory_id, bom_id, p_prod_id, prod_id, c_usage, t_usage, sortby) AS (
			SELECT DISTINCT 0,
				a.factory_id,
				0,
				a.prod_id,
				a.prod_id,
				1.0,
				1.0,
				a.prod_id::text AS p_prod_id
			FROM std_bom_tree_vw a
			JOIN std_prod_tb s_p ON s_p.prod_id = a.prod_id
			WHERE s_p.uuid = '${prodUuid}'
			UNION
				SELECT c.lv + 1,
				a.factory_id,
				a.bom_id,
				a.p_prod_id,
				a.prod_id,
				a.c_usage,
				(c.t_usage * a.c_usage)::numeric(19,6) AS "numeric",
				concat(c.sortby, ' > ', a.prod_id::text) AS concat
			FROM std_bom_tree_vw a
			JOIN bom_cte c ON c.prod_id = a.p_prod_id 
		)

		INSERT INTO temp_bom_tree_vw
		SELECT 
			bom_cte.lv,
			bom_cte.factory_id,
			bom_cte.bom_id,
			bom_cte.p_prod_id,
			bom_cte.prod_id,
			bom_cte.c_usage,
			bom_cte.t_usage,
			bom_cte.sortby
		FROM bom_cte
		ORDER BY bom_cte.sortby;  
  `;

  const query = `
    ${createTempTable}

    SELECT
      concat(repeat('...',t_vb.lv),cast(t_vb.lv as varchar)) as lv,
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
      t_b.c_usage,
      t_vb.t_usage,
      s_u.uuid as unit_uuid,
      s_u.unit_cd,
      s_u.unit_nm,
      a_bit.uuid as bom_input_type_uuid,
      a_bit.bom_input_type_cd,
      a_bit.bom_input_type_nm,
      s_s.uuid as from_store_uuid,
      s_s.store_cd as from_store_cd,
      s_s.store_nm as from_store_nm,
      s_l.uuid as from_location_uuid,
      s_l.location_cd as from_location_cd,
      s_l.location_nm as from_location_nm,
      t_b.remark		
    FROM temp_bom_tree_vw t_vb
    JOIN std_prod_tb s_p ON s_p.prod_id = t_vb.prod_id
    JOIN std_factory_tb s_f ON s_f.factory_id = t_vb.factory_id
    LEFT JOIN std_bom_tb t_b ON t_b.bom_id = t_vb.bom_id 
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = t_b.unit_id
    LEFT JOIN adm_bom_input_type_tb a_bit ON a_bit.bom_input_type_id = t_b.bom_input_type_id
    LEFT JOIN std_store_tb s_s ON s_s.store_id = t_b.from_store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = t_b.from_location_id
    ${factoryUuid? `WHERE s_f.uuid = '${factoryUuid}'`: ''}
    ORDER BY t_vb.sortby;

    DROP TABLE temp_bom_tree_vw;
  `;

  return query;
}

export { readToProdOfDownTrees }