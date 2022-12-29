const readOrders = (
  params: {
    start_date?: string,
    end_date?: string,
    order_uuid?: string,
    factory_uuid?: string,
    sal_order_detail_uuid?: string,
    order_state?: 'all' | 'wait' | 'ongoing' | 'complete'
  }) => {
  let searchQuery: string = '';

  //#region 📌 작업지시 정보 임시테이블 생성 및 삽입
  if (params.order_uuid) { searchQuery += ` AND p_o.uuid = '${params.order_uuid}'`; }
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.sal_order_detail_uuid) { searchQuery += ` AND s_od.uuid = '${params.sal_order_detail_uuid}'`; }
  if (params.start_date && params.end_date) { searchQuery += ` AND date(p_o.reg_date) BETWEEN '${params.start_date}' AND '${params.end_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const createTempTableRouting = `
    /** 임시테이블 생성 */
    CREATE TEMP TABLE temp_order_routing(factory_id int, order_id int, proc_id int, equip_id int, mold_id int, mold_cavity int);
    /** 임시테이블 인덱스 설정 */
    CREATE INDEX ON temp_order_routing(order_id);

    /** wait */
    -- 대기상태인 지시기준으로 라우팅정보를 가져올때는 공정순서가 가장 빠른 공정을 가져옴
    WITH wait AS
    (
      SELECT 
        p_or.factory_id, p_or.order_id, p_or.proc_id, p_or.equip_id, p_or.mold_id, p_or.mold_cavity, 
        rank() over(PARTITION BY p_or.factory_id, p_or.order_id ORDER BY p_or.proc_no ASC) AS rn
      FROM prd_order_routing_tb p_or
      JOIN prd_order_tb p_o ON p_o.order_id = p_or.order_id 
      WHERE p_o.complete_fg = FALSE AND p_o.work_fg = FALSE 
    )
    INSERT INTO temp_order_routing
    SELECT factory_id, order_id, proc_id, equip_id, mold_id, mold_cavity 
    FROM wait 
    WHERE rn = 1;
    
    /** complete */
    -- 마감된 지시 기준으로 라우팅정보를 가져올때는 공정순서가 마지막인 공정을 가져옴
    WITH complete AS
    (
      SELECT 
        p_or.factory_id, p_or.order_id, p_or.proc_id, p_or.equip_id, p_or.mold_id, p_or.mold_cavity, 
        rank() over(PARTITION BY p_or.factory_id, p_or.order_id ORDER BY p_or.proc_no DESC) AS rn
      FROM prd_order_routing_tb p_or
      JOIN prd_order_tb p_o ON p_o.order_id = p_or.order_id 
      WHERE p_o.complete_fg = TRUE 
    )
    INSERT INTO temp_order_routing
    SELECT factory_id, order_id, proc_id, equip_id, mold_id, mold_cavity 
    FROM complete 
    WHERE rn = 1;
    
    /** ongoing */
    -- 작업중인 실적 기준으로 현재 생산공정에 대한 데이터를 가져오기 위한 쿼리
    -- 첫번째 기준 : ongoing_fg(현재 생산중인 공정에 대한 Flag)값이 True인 공정 중 마지막공정
    -- 두번째 기준 : 양품수량이 등록 되어있는 공정 중 마지막 공정
    -- 세번째 기준 : 위 두개 기준에 모두 값이 null 또는 false 인 경우 작업은 시작했지만 생산이 되지 않았다고 판단하여 첫번째 공정을 가져옴
    WITH ongoing AS 
    (
      SELECT
        p_wr.factory_id, p_w.order_id, p_wr.proc_id, p_wr.equip_id, p_wr.mold_id, p_wr.mold_cavity, 
        max(COALESCE(p_wr.ongoing_fg,FALSE)::int * p_wr.proc_no), max((CASE WHEN COALESCE(p_wr.qty,0) > 0 THEN 1 ELSE 0 END) * p_wr.proc_no),
        rank() over(PARTITION BY p_wr.factory_id, p_w.order_id ORDER BY max(COALESCE(p_wr.ongoing_fg,FALSE)::int * p_wr.proc_no) DESC, max((CASE WHEN COALESCE(p_wr.qty,0) > 0 THEN 1 ELSE 0 END) * p_wr.proc_no) DESC, p_wr.proc_no ASC) AS rn
      FROM prd_work_routing_tb p_wr
      JOIN prd_work_tb p_w ON p_w.work_id = p_wr.work_id
      WHERE p_w.complete_fg = FALSE
      GROUP BY p_wr.factory_id, p_w.order_id, p_wr.proc_id, p_wr.proc_no, p_wr.equip_id, p_wr.mold_id, p_wr.mold_cavity
    )
    INSERT INTO temp_order_routing
    SELECT factory_id, order_id, proc_id, equip_id, mold_id, mold_cavity
    FROM ongoing 
    WHERE rn = 1;
  `;

  const createTempTable = `
    CREATE TEMP TABLE temp_order AS
    SELECT
      p_o.uuid as order_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      p_o.reg_date,
      p_o.order_no,
      s_pc.uuid as proc_uuid,
      s_pc.proc_cd,
      s_pc.proc_nm,
      s_ws.uuid as workings_uuid,
      s_ws.workings_cd,
      s_ws.workings_nm,
      s_e.uuid as equip_uuid,
      s_e.equip_cd,
      s_e.equip_nm,
      m_m.uuid as mold_uuid,
      m_m.mold_cd,
      m_m.mold_nm,
      m_m.mold_no,
      t_or.mold_cavity,
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
      t_ss.uuid as to_store_uuid,
      t_ss.store_cd as to_store_cd,
      t_ss.store_nm as to_store_nm,
      t_sl.uuid as to_location_uuid,
      t_sl.location_cd as to_location_cd,
      t_sl.location_nm as to_location_nm,
      p_o.plan_qty,
			p_pm.balance AS monthly_balance,
      p_o.qty,
      p_w.qty as accumulated_qty,
      p_w.reject_qty as accumulated_reject_qty,
      p_w.qty + p_w.reject_qty as accumulated_total_qty,
      p_o.seq,
      s_sf.uuid as shift_uuid,
      s_sf.shift_nm,
      p_o.start_date,
      p_o.end_date,
      s_wg.uuid as worker_group_uuid,
      s_wg.worker_group_cd,
      s_wg.worker_group_nm,
      CAST(COALESCE(p_ow.cnt,0) AS int) as worker_cnt,
      s_o.uuid as sal_order_uuid,
      s_od.uuid as sal_order_detail_uuid,
      p_o.work_fg,
      p_o.complete_fg,
      CASE WHEN p_o.complete_fg = TRUE THEN '마감' ELSE 
      CASE WHEN p_o.work_fg = TRUE THEN '작업중' ELSE '대기' END END AS order_state,
			p_o.priority as priority,
      p_o.complete_date,
      p_o.remark,
      p_o.created_at,
      p_o.created_uid,
      a_uc.user_nm AS created_nm,
      p_o.updated_at,
      p_o.updated_uid,
      a_uu.user_nm AS updated_nm
    FROM prd_order_tb p_o
    JOIN std_factory_tb s_f ON s_f.factory_id = p_o.factory_id
    JOIN std_workings_tb s_ws ON s_ws.workings_id = p_o.workings_id
    LEFT JOIN temp_order_routing t_or ON t_or.order_id = p_o.order_id
    LEFT JOIN std_proc_tb s_pc ON s_pc.proc_id = t_or.proc_id
    LEFT JOIN std_equip_tb s_e ON s_e.equip_id = t_or.equip_id
    LEFT JOIN mld_mold_tb m_m ON m_m.mold_id = t_or.mold_id
    JOIN std_prod_tb s_p ON s_p.prod_id = p_o.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_store_tb t_ss ON t_ss.store_id = s_p.inv_to_store_id
    LEFT JOIN std_location_tb t_sl ON t_sl.location_id = s_p.inv_to_location_id
    JOIN std_shift_tb s_sf ON s_sf.shift_id = p_o.shift_id
    LEFT JOIN std_worker_group_tb s_wg ON s_wg.worker_group_id = p_o.worker_group_id
    LEFT JOIN sal_order_detail_tb s_od ON s_od.order_detail_id = p_o.sal_order_detail_id
    LEFT JOIN sal_order_tb s_o ON s_o.order_id = s_od.order_id
    LEFT JOIN (	SELECT p_w.order_id, sum(COALESCE(p_w.qty, 0)) AS qty, sum(COALESCE(p_w.reject_qty, 0)) AS reject_qty
                FROM prd_work_tb p_w
                GROUP BY p_w.order_id ) p_w ON p_w.order_id = p_o.order_id
		LEFT JOIN prd_plan_daily_tb p_pdt ON p_pdt.plan_daily_id = p_o.plan_daily_id
    LEFT JOIN (	SELECT p_ow.order_id, count(p_ow.*) AS cnt 
                FROM prd_order_worker_tb p_ow
                GROUP BY p_ow.order_id ) p_ow ON p_ow.order_id = p_o.order_id
								LEFT JOIN (
									SELECT 
										sub_p_pm.plan_monthly_id, 
										CASE WHEN (sub_p_pm.plan_monthly_qty  - COALESCE(sub_p_pdt.plan_daily_qty,0)) < 0 THEN 0 ELSE sub_p_pm.plan_monthly_qty  - COALESCE(sub_p_pdt.plan_daily_qty,0) END AS balance
									FROM prd_plan_monthly_tb sub_p_pm
									LEFT JOIN (
										SELECT sum(plan_daily_qty) AS plan_daily_qty,plan_monthly_id 
										FROM prd_plan_daily_tb
										GROUP BY plan_monthly_id 
									) sub_p_pdt ON sub_p_pm.plan_monthly_id = sub_p_pdt.plan_monthly_id 
		)p_pm ON p_pdt.plan_monthly_id = p_pm.plan_monthly_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_o.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_o.updated_uid
    ${searchQuery};

    /** 임시테이블 인덱스 설정 */
    CREATE INDEX ON temp_order(order_uuid);
    CREATE INDEX ON temp_order(order_state);
  `;
  //#endregion

  //#region 📌 Filtering 및 조회
  searchQuery = '';
  switch (params.order_state) {
    case 'all': break;
    case 'wait': searchQuery = `WHERE t_o.order_state = '대기'`; break;
    case 'ongoing': searchQuery = `WHERE t_o.order_state = '진행중'`; break;
    case 'complete': searchQuery = `WHERE t_o.order_state = '마감'`; break;
    default: break;
  }

  // 📌 Filtering 하여 임시테이블 조회
  const readOrder = `
    SELECT *
    FROM temp_order t_o
    ${searchQuery}
    ORDER BY t_o.reg_date;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTable = `
    DROP TABLE temp_order_routing;
    DROP TABLE temp_order;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 작업지시 정보를 가져오기 전 작업 별 공정, 설비, 금형에 대한 데이터 셋팅
    ${createTempTableRouting}
    
    -- 작업지시 정보를 가지고있는 임시테이블 생성 및 데이터 삽입
    ${createTempTable}

    -- Filtering 하여 임시테이블 조회
    ${readOrder}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTable}
  `;
  //#endregion

  return query;
}

export { readOrders }