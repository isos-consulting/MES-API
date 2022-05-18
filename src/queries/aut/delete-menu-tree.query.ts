const deleteMenuTree = (menuId: number) => {
  const query = `
    -- 📌 Menu Tree 형태의 하위 UUID 조회
		WITH RECURSIVE menu_cte(lv, menu_id, uuid) AS (
			SELECT 1,
				a.menu_id,         
				a.uuid 
				FROM aut_menu_tb a
			WHERE a.menu_id = ${menuId}

			UNION

			SELECT c.lv + 1,
				b.menu_id,
				b.uuid                         
				FROM aut_menu_tb b,
				menu_cte c
			WHERE b.parent_id = c.menu_id
		)
	SELECT 
		menu_cte.lv,
		menu_cte.menu_id,
		menu_cte.uuid
	FROM menu_cte
  `;

  return query;
}

export default deleteMenuTree;