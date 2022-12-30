const readWithWorkings = (
  params: {
    factory_uuid : string,
  }) => {
    let searchQuery: string = '';
    if (params.factory_uuid) { searchQuery += ` AND s_ft.uuid = '${params.factory_uuid}'`; }


    const query = `
      /** ✅ 결과조회 */
			SELECT 
				s_ft.uuid AS factory_uuid,
				s_ft.factory_cd AS factory_cd,
				s_ft.factory_nm AS factory_nm,
				s_pt.uuid AS prod_uuid,
				s_pt.prod_no AS prod_no,
				s_pt.prod_nm AS prod_nm,
				s_itt.uuid AS item_type_uuid,
				s_itt.item_type_cd AS item_type_cd,
				s_itt.item_type_nm AS item_type_nm,
				s_ptt.uuid AS prod_type_uuid,
				s_ptt.prod_type_cd AS prod_type_cd,
				s_ptt.prod_type_nm AS prod_type_nm,
				s_mt.uuid AS model_uuid,
				s_mt.model_cd AS model_cd,
				s_mt.model_nm AS model_nm,
				s_pt.rev AS rev,
				s_pt.prod_std AS prod_std,
				STRING_AGG(s_wt.workings_nm, ', ') AS workings_nm,
				s_pt.created_at,
				a_c.user_nm,
				s_pt.updated_at,
				a_u.user_nm
			FROM std_prod_tb s_pt 
			LEFT JOIN std_routing_workings_tb s_rwt ON s_rwt.prod_id = s_pt.prod_id 
			LEFT JOIN std_workings_tb s_wt ON s_wt.workings_id = s_rwt.workings_id
			LEFT JOIN std_factory_tb s_ft ON s_ft.factory_id = s_rwt.factory_id 
			LEFT JOIN STD_ITEM_TYPE_TB s_itt ON	s_itt.item_type_id = s_pt.item_type_id
			LEFT JOIN STD_PROD_TYPE_TB s_ptt ON	s_ptt.prod_type_id = s_pt.prod_type_id
			LEFT JOIN STD_MODEL_TB s_mt ON s_mt.model_id = s_pt.model_id
			LEFT JOIN STD_UNIT_TB s_ut ON s_ut.unit_id = s_pt.unit_id
			LEFT JOIN aut_user_tb a_c ON a_c.uid = s_pt.created_uid 
			LEFT JOIN aut_user_tb a_u ON a_u.uid = s_pt.updated_uid 
			WHERE s_pt.active_fg = TRUE 
			${searchQuery}
			GROUP BY 
				s_ft.uuid,
				s_ft.factory_cd,
				s_ft.factory_nm ,
				s_pt.uuid ,
				s_pt.prod_id,
				s_pt.prod_no ,
				s_pt.prod_nm , 
				s_itt.uuid ,
				s_itt.item_type_cd ,
				s_itt.item_type_nm ,
				s_ptt.uuid ,
				s_ptt.prod_type_cd ,
				s_ptt.prod_type_nm ,
				s_mt.uuid ,
				s_mt.model_cd ,
				s_mt.model_nm ,
				s_pt.rev ,
				s_pt.prod_std ,
				s_pt.created_at,
				a_c.user_nm,
				s_pt.updated_at,
				a_u.user_nm
			ORDER BY s_pt.prod_id
    `;

    return query;
  }

export { readWithWorkings }