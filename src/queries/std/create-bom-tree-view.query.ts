const createBomTreeView = () => {
  const query = `
    -- 📌 BOM Tree 형태의 MATERIALIZED VIEW 생성
    CREATE MATERIALIZED VIEW STD_BOM_TREE_VW AS
      WITH RECURSIVE bom_cte(lv, factory_id, bom_id, main_prod_id, p_prod_id, prod_id, c_usage, t_usage, sortby) AS (
        SELECT DISTINCT
					0,
          a.factory_id,
          0,
					a.p_prod_id,
					a.p_prod_id,
					a.p_prod_id,
          1.0,
					1.0,
					cast(a.p_prod_id as text)
				FROM std_bom_tb a
				LEFT JOIN std_bom_tb b ON b.c_prod_id = a.p_prod_id
				LEFT JOIN std_bom_tb c ON a.p_prod_id = c.c_prod_id
        WHERE c.bom_id IS NULL

        UNION

        SELECT 
          c.lv + 1,
          a.factory_id,
          a.bom_id,
          c.main_prod_id,
          a.p_prod_id,
          a.c_prod_id,
          a.c_usage,
          (c.t_usage * a.c_usage):: NUMERIC(19,6),
          concat(c.sortby, ' > ',  CAST(a.c_prod_id as text))
        FROM std_bom_tb a, bom_cte c
        WHERE a.p_prod_id = c.prod_id
      )

      SELECT * FROM bom_cte;

    -- 📌 Index 생성
    CREATE INDEX ON STD_BOM_TREE_VW(bom_id);
    CREATE INDEX ON STD_BOM_TREE_VW(main_prod_id);
    CREATE INDEX ON STD_BOM_TREE_VW(p_prod_id);
    CREATE INDEX ON STD_BOM_TREE_VW(prod_id);
    CREATE INDEX ON STD_BOM_TREE_VW(main_prod_id, sortby);
  `;

  return query;
}

export default createBomTreeView;