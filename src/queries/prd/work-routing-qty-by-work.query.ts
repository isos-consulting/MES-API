const readFinalQtyByWork = (workId?: number) => {
  const query = `
    WITH complete AS
    (
			SELECT 
				p_wr.factory_id,
				p_wr.work_id,
				p_wr.proc_no,
				coalesce(p_wr.qty,0) as qty,
				rank() over(PARTITION BY p_wro.factory_id, p_wro.work_id ORDER BY p_wro.proc_no DESC) AS rn
			FROM prd_work_routing_origin_tb p_wro 
			LEFT JOIN prd_work_routing_tb p_wr ON p_wro.work_routing_origin_id = p_wr.work_routing_origin_id
			WHERE p_wro.work_id = ${workId}
    )
    SELECT 
			sum(qty) as qty
		FROM complete 
		WHERE rn = 1
		GROUP BY work_id;
  `;

  return query;
}

export { readFinalQtyByWork }