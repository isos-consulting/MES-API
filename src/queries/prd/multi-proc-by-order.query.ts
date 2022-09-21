
const readMultiProcByOrder = (
  params: {
    start_date: string,
    end_date: string
  }) => {
  //#region 📌 작업지시 임시테이블 생성
  const createTempTable = `
    -- 📌 작업지시 임시테이블 생성
    CREATE TEMP TABLE temp_order (order_id int, order_no varchar, reg_date timestamp, workings_id int, order_qty numeric, prod_id int, order_state text);
    CREATE INDEX ON temp_order(order_id);
    CREATE INDEX ON temp_order(workings_id);
    CREATE INDEX ON temp_order(prod_id);
  `;
  //#endregion
  
  //#region 📌 작업지시 임시테이블 데이터 저장
  const insertTempTable = `
    INSERT INTO temp_order
    SELECT
      p_o.order_id, p_o.order_no, p_o.reg_date, p_o.workings_id, p_o.qty, p_o.prod_id,
      CASE WHEN p_o.complete_fg = TRUE THEN '마감' ELSE 
      CASE WHEN p_o.work_fg = TRUE THEN '작업중' ELSE '대기' END END AS order_state
    FROM prd_order_tb p_o
    WHERE p_o.reg_date::date BETWEEN '${params.start_date}' AND '${params.end_date}';
  `;
  //#endregion

  //#region 📌 추가 테이블 Join 및 조회
  // 📌 다공정 데이터를 메인 임시테이블에 JOIN하여 조회
  const readQuery = `
    SELECT 
      t_o.order_id, 
      t_o.order_no, 
      t_o.reg_date,
      s_w.uuid as workings_uuid, 
      s_w.workings_cd, 
      s_w.workings_nm, 
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
      s_u.uuid as unit_uuid,
      s_u.unit_cd,
      s_u.unit_nm,
      t_o.order_qty::numeric(19,0) as order_qty, 
      t_o.order_state, 
      p_w.work_id, 
      p_wr.proc_no,
      p_wr.proc_uuid as proc_uuid,
      p_wr.proc_cd,
      p_wr.proc_nm,
      p_wr.total_qty AS total_qty,
      p_wr.qty as qty,
      p_wr.reject_qty AS reject_qty
    FROM temp_order t_o
    JOIN std_workings_tb s_w on s_w.workings_id = t_o.workings_id
    JOIN std_prod_tb s_p ON s_p.prod_id = t_o.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    JOIN prd_work_tb p_w ON p_w.order_id = t_o.order_id
    JOIN (SELECT 
						p_wr.work_id, 
						p_wr.proc_no,
						s_pc.uuid as proc_uuid,
						s_pc.proc_cd,
						s_pc.proc_nm,
						(sum(COALESCE(p_wr.qty,0)) + sum(COALESCE(p_wr2.qty,0)))::numeric(19,0) AS total_qty,
						sum(COALESCE(p_wr.qty,0))::numeric(19,0) as qty,
						sum(COALESCE(p_wr2.qty,0))::numeric(19,0) AS reject_qty
			FROM prd_work_routing_tb p_wr 
			JOIN std_proc_tb s_pc ON s_pc.proc_id = p_wr.proc_id
			LEFT JOIN ( SELECT work_routing_id, sum(qty) AS qty
									FROM prd_work_reject_tb
									GROUP BY work_routing_id ) p_wr2 ON p_wr2.work_routing_id = p_wr.work_routing_id
			GROUP BY p_wr.work_id, p_wr.proc_no, s_pc.uuid , s_pc.proc_cd, s_pc.proc_nm) p_wr ON p_wr.work_id = p_w.work_id
    ORDER BY t_o.reg_date, t_o.order_id, p_wr.proc_no;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
    DROP TABLE temp_order;	
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 생산실적UUID로 작업지시ID 추출
    DO $$
    BEGIN

    -- 기간 별 작업지시 이력 임시테이블 생성 및 데이터 저장
    ${createTempTable}
    ${insertTempTable}

    END $$;

    -- 메인 임시테이블에 JOIN하여 조회
    ${readQuery}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readMultiProcByOrder }