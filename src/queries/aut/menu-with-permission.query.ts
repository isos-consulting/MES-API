const readMenuWithPermission = (uid: number) => {
  const createMenuTempTable = `
    -- 생산실적UUID로 작업지시ID 추출
    DO $$
    DECLARE sch_admin boolean;
    DECLARE sch_groupId int;

    BEGIN
    -- 📌 관리자 여부 확인 후 관리자일 경우 모든 메뉴의 Super 권한 부여
    SELECT admin_fg, group_id INTO sch_admin, sch_groupId FROM aut_user_tb WHERE uid = ${uid};
    
    -- 📌 메뉴별 사용자 권한 및 사용자가 속한 그룹의 권한 적용
    CREATE TEMP TABLE temp_menu (
      lv int,
      first_menu_id int,
      menu_id int,
      parent_id int,
      menu_type TEXT,
      create_fg boolean,
      read_fg boolean,
      update_fg boolean,
      delete_fg boolean,
      sortby TEXT,
      read_chk int
    );
    CREATE INDEX ON temp_menu(menu_id);
    CREATE INDEX ON temp_menu(sortby);

    INSERT INTO temp_menu
    SELECT a.*
    FROM (	SELECT 	a_mtv.lv, a_mtv.first_menu_id, a_mtv.menu_id, a_mtv.parent_id,
          CASE WHEN a_mtv.menu_type_id IS NULL THEN 'menu' ELSE 'page' END AS menu_type,
          CASE WHEN sch_admin = TRUE THEN a_mt.create_fg 
          ELSE CASE WHEN COALESCE(a_mt.create_fg, FALSE) = FALSE THEN FALSE ELSE a_p.create_fg END END create_fg,
          CASE WHEN sch_admin = TRUE THEN a_mt.read_fg 
          ELSE CASE WHEN COALESCE(a_mt.read_fg, FALSE) = FALSE THEN FALSE ELSE a_p.read_fg END END read_fg,
          CASE WHEN sch_admin = TRUE THEN a_mt.update_fg 
          ELSE CASE WHEN COALESCE(a_mt.update_fg, FALSE) = FALSE THEN FALSE ELSE a_p.update_fg END END update_fg,
          CASE WHEN sch_admin = TRUE THEN a_mt.delete_fg 
          ELSE CASE WHEN COALESCE(a_mt.delete_fg, FALSE) = FALSE THEN FALSE ELSE a_p.delete_fg END END delete_fg,
          a_mtv.sortby,
          CASE WHEN a_mtv.menu_type_id IS NULL THEN 0
          ELSE 	CASE WHEN sch_admin = TRUE THEN (CASE WHEN a_mt.read_fg = TRUE THEN 1 ELSE 0 END)
              ELSE 	CASE WHEN (CASE WHEN COALESCE(a_mt.read_fg, FALSE) = FALSE THEN FALSE ELSE a_p.read_fg END) = TRUE THEN 1 
                  ELSE 0 END END END AS read_chk
        FROM aut_menu_tree_vw a_mtv 
        LEFT JOIN aut_menu_type_tb a_mt ON a_mt.menu_type_id = a_mtv.menu_type_id
        JOIN (	SELECT a.menu_id, a_p.create_fg, a_p.read_fg, a_p.update_fg, a_p.delete_fg
              FROM (	SELECT 	a_m.menu_id, 
                      CASE WHEN a_up.user_permission_id IS NOT NULL THEN a_up.permission_id ELSE COALESCE(a_up.permission_id, a_gp.permission_id) END AS permission_id
                  FROM aut_menu_tb a_m 
                  LEFT JOIN aut_user_permission_tb a_up ON a_up.menu_id = a_m.menu_id AND a_up.uid = ${uid}
                  LEFT JOIN aut_group_permission_tb a_gp ON a_gp.menu_id = a_m.menu_id AND a_gp.group_id = sch_groupId
                  WHERE use_fg = TRUE) a 
              LEFT JOIN aut_permission_tb a_p ON a_p.permission_id = a.permission_id) a_p ON a_p.menu_id = a_mtv.menu_id) a 
    JOIN aut_menu_tb a_m ON a_m.menu_id = a.menu_id
    WHERE NOT (a.menu_type = 'page' AND a.read_chk = 0);

    END $$;
  `;

  const deleteUnauthorizedMenu = `
    -- 📌 Lv2 사용하지않는 메뉴 제거
    DELETE FROM temp_menu t_m
    WHERE t_m.menu_id IN (	
      SELECT t_m.menu_id FROM temp_menu t_m
      LEFT JOIN temp_menu t_m2 ON t_m2.parent_id = t_m.menu_id
      WHERE t_m.lv= 2 AND t_m.menu_type = 'menu'
      GROUP BY t_m.menu_id
      HAVING sum(COALESCE(t_m2.read_chk,0)) = 0);

    -- 📌 남아있는 Lv2 read_chk UPDATE
    UPDATE temp_menu t_m
    SET read_chk = 1
    WHERE t_m.lv = 2;

    -- 📌 Lv1 사용안하는 메뉴 제거
    DELETE FROM temp_menu t_m
    WHERE t_m.menu_id IN (	
      SELECT t_m.menu_id FROM temp_menu t_m
      LEFT JOIN temp_menu t_m2 ON t_m2.parent_id = t_m.menu_id
      WHERE t_m.lv= 1 AND t_m.menu_type = 'menu'
      GROUP BY t_m.menu_id
      HAVING sum(COALESCE(t_m2.read_chk,0)) = 0);
  `;

  const readMenu = `
    SELECT 
      t_m.lv,
      t_m.menu_type,
      first.uuid as first_menu_uuid,
      a_m.uuid as menu_uuid,
      a_m.menu_uri,
      a_m.menu_nm,
      a_m.component_nm,
      a_m.icon,
      t_m.create_fg,
      t_m.read_fg,
      t_m.update_fg,
      t_m.delete_fg
    FROM temp_menu t_m 
    JOIN aut_menu_tb a_m ON a_m.menu_id = t_m.menu_id
    JOIN aut_menu_tb first ON first.menu_id = t_m.first_menu_id
    ORDER BY t_m.sortby;
  `;

  const dropTempTable = `
    DROP TABLE temp_menu;
  `;

  const query = `
    -- 📌 메뉴별 사용자 권한 및 사용자가 속한 그룹의 권한 적용한 임시테이블 생성
    ${createMenuTempTable}

    -- 📌 권한이 없는 메뉴 삭제
    ${deleteUnauthorizedMenu}

    -- 📌 메뉴 및 권한 조회
    ${readMenu}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readMenuWithPermission }