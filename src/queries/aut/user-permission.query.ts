const readUserPermission = (uuid: string) => {
  const read = `
    SELECT
			AutMenuTree.menu_id,
			autMenu.uuid AS menu_uuid,
			autMenu.menu_nm AS menu_nm,
			firstMenu.menu_nm AS first_menu_nm,
			AutMenuTree.lv,
			AutMenuTree.sortby,
			A_UT.uuid AS menu_type_uuid,
			A_UT.menu_type_nm AS menu_type_nm,
			autUserPermission.uuid AS user_permission_uuid,
			COALESCE(A_UP.uuid, A_GP.uuid) AS permission_uuid,
			COALESCE(A_UP.permission_nm, A_GP.permission_nm) AS permission_nm,
			A_UCREATE.created_at AS created_at,
			A_UCREATE.user_nm AS created_nm,
			A_UUPDATE.updated_at AS updated_at,
			A_UUPDATE.user_nm AS updated_nm
		FROM AUT_MENU_TREE_VW AS AutMenuTree
		INNER JOIN AUT_MENU_TB AS autMenu ON AutMenuTree.menu_id = autMenu.menu_id
		LEFT OUTER JOIN AUT_MENU_TYPE_TB AS A_UT ON autMenu.menu_type_id = A_UT.menu_type_id
		LEFT OUTER JOIN ( AUT_USER_PERMISSION_TB AS autUserPermission
			INNER JOIN AUT_USER_TB AS A_U ON autUserPermission.uid = A_U.uid AND A_U.uuid = '9c421d16-1e0e-4a95-9b32-ea9ad46bacf1'
			LEFT OUTER JOIN AUT_PERMISSION_TB AS A_UP ON autUserPermission.permission_id = A_UP.permission_id
			INNER JOIN AUT_USER_TB AS A_UCREATE ON autUserPermission.created_uid = A_UCREATE.uid
			INNER JOIN AUT_USER_TB AS A_UUPDATE ON autUserPermission.updated_uid = A_UUPDATE.uid ) ON AutMenuTree.menu_id = autUserPermission.menu_id
		LEFT OUTER JOIN AUT_GROUP_PERMISSION_TB AS autGroupPermission ON AutMenuTree.menu_id = autGroupPermission.menu_id
			AND autGroupPermission.group_id = ( SELECT group_id FROM aut_user_tb WHERE uuid = '${uuid}' )
		LEFT OUTER JOIN AUT_PERMISSION_TB AS A_GP ON autGroupPermission.permission_id = A_GP.permission_id
		INNER JOIN AUT_MENU_TB AS firstMenu ON AutMenuTree.first_menu_id = firstMenu.menu_id
		ORDER BY AutMenuTree.sortby;
  `;

  const query = `
    -- 📌 메뉴 및 권한 조회
    ${read}
  `;

  return query;
}

export { readUserPermission }