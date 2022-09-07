const readFinalRejectQtyByWork = (workId?: number) => {
  const query = `
    WITH work_reject AS
    (
      SELECT 
        factory_id, work_id, work_routing_id, proc_no,
        rank() over(PARTITION BY factory_id, work_id ORDER BY proc_no DESC) AS rn
      FROM prd_work_routing_tb
      WHERE work_id = ${workId}
    )
    SELECT 
			sum(COALESCE(p_wr.qty,0)) AS qty
    FROM work_reject wr
    LEFT JOIN prd_work_reject_tb p_wr ON p_wr.work_routing_id = wr.work_routing_id
    WHERE wr.rn = 1
		GROUP BY wr.work_routing_id;
  `;

  return query;
}

export { readFinalRejectQtyByWork }