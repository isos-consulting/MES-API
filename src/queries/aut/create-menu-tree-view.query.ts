const createMenuTreeView = () => {
  const query = `
    -- 📌 Menu Tree 형태의 MATERIALIZED VIEW 생성
    CREATE MATERIALIZED VIEW AUT_MENU_TREE_VW AS
      WITH RECURSIVE menu_cte(lv, menu_id, menu_type_id, parent_id, sortby, first_menu_id) AS (
        SELECT
          1,
          a.menu_id,
          a.menu_type_id,
          a.parent_id,
          RIGHT(concat(CAST('00' AS varchar),cast(a.sortby as varchar)), 2),
          a.menu_id
        FROM aut_menu_tb a
        WHERE a.parent_id = 0

        UNION

        SELECT
          c.lv + 1,
          b.menu_id,
          b.menu_type_id,
          b.parent_id,
          concat(CAST(c.sortby AS varchar), ' > ',  CAST(RIGHT(concat(CAST('00' AS varchar), CAST(b.sortby as varchar)), 2) AS TEXT)),
          c.first_menu_id
        FROM aut_menu_tb B, menu_cte c
        WHERE b.parent_id = c.menu_id
      )

      SELECT * FROM menu_cte;

    -- 📌 menu_id, sortby 각각 Index 생성
    CREATE INDEX ON AUT_MENU_TREE_VW(menu_id);
    CREATE INDEX ON AUT_MENU_TREE_VW(sortby);
  `;

  return query;
}

export default createMenuTreeView;