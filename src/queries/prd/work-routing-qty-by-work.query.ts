const readFinalQtyByWork = (workId?: number) => {
  const query = `
    WITH complete AS
    (
      SELECT 
        factory_id, work_id, proc_no, coalesce(qty,0) as qty,
        rank() over(PARTITION BY factory_id, work_id ORDER BY proc_no DESC) AS rn
      FROM prd_work_routing_tb
      WHERE work_id = ${workId}
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