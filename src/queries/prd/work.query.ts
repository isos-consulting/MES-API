import TTenantOpt, { PRD_METHOD_REJECT_QTY } from "../../types/tenant-opt.type";

const readWorks = (
  params: {
    start_date?: string,
    end_date?: string,
    work_uuid?: string,
    order_uuid?: string,
    factory_uuid?: string,
    prod_uuid?: string,
    complete_fg?: boolean,
    opt_reject_qty?: TTenantOpt
  }) => {
  let searchQuery: string = '';

  if (params.work_uuid) { searchQuery += ` AND p_w.uuid = '${params.work_uuid}'`; }
  if (params.order_uuid) { searchQuery += ` AND p_o.uuid = '${params.order_uuid}'`; }
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.prod_uuid) { searchQuery += ` AND s_p.uuid = '${params.prod_uuid}'`; }
  if (params.complete_fg != null) { searchQuery += ` AND p_w.complete_fg = ${params.complete_fg}`; }
  if (params.start_date && params.end_date) { searchQuery += ` AND date(p_w.reg_date) BETWEEN '${params.start_date}' AND '${params.end_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const createTempTableRouting = `
    /** 임시테이블 생성 */
    CREATE TEMP TABLE temp_work_routing(factory_id int, work_id int, proc_id int, equip_id int, mold_id int, mold_cavity int, start_date timestamp, end_date timestamp, qty numeric, reject_qty numeric);
    /** 임시테이블 인덱스 설정 */
    CREATE INDEX ON temp_work_routing(work_id);

    /** complete */
    -- 마감된 지시 기준으로 라우팅정보를 가져올때는 공정순서가 마지막인 공정을 가져옴
    WITH complete AS
    (
      SELECT 
        p_wr.factory_id, p_wr.work_id, p_wr.proc_id, p_wr.equip_id, p_wr.mold_id, p_wr.mold_cavity, p_wr.start_date, p_wr.end_date, 0::numeric as qty,
        rank() over(PARTITION BY p_wr.factory_id, p_wr.work_id ORDER BY p_wr.proc_no DESC) AS rn
      FROM prd_work_routing_tb p_wr
      JOIN prd_work_tb p_w ON p_w.work_id = p_wr.work_id 
      WHERE p_w.complete_fg = TRUE 
    )
    INSERT INTO temp_work_routing
    SELECT factory_id, work_id, proc_id, equip_id, mold_id, mold_cavity, start_date, end_date, qty
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
        p_wr.factory_id, p_wr.work_id, p_wr.proc_id, p_wr.equip_id, p_wr.mold_id, p_wr.mold_cavity, p_wr.start_date, p_wr.end_date, p_wr.qty,
        max(COALESCE(p_wr.ongoing_fg,FALSE)::int * p_wr.proc_no), max((CASE WHEN COALESCE(p_wr.qty,0) > 0 THEN 1 ELSE 0 END) * p_wr.proc_no),
        rank() over(PARTITION BY p_wr.factory_id, p_wr.work_id ORDER BY max(COALESCE(p_wr.ongoing_fg,FALSE)::int * p_wr.proc_no) DESC, max((CASE WHEN COALESCE(p_wr.qty,0) > 0 THEN 1 ELSE 0 END) * p_wr.proc_no) DESC, p_wr.proc_no ASC) AS rn
      FROM prd_work_routing_tb p_wr
      JOIN prd_work_tb p_w ON p_w.work_id = p_wr.work_id
      WHERE p_w.complete_fg = FALSE
      GROUP BY p_wr.factory_id, p_wr.work_id, p_wr.proc_id, p_wr.proc_no, p_wr.equip_id, p_wr.mold_id, p_wr.mold_cavity, p_wr.start_date, p_wr.end_date, p_wr.qty
    )
    INSERT INTO temp_work_routing
    SELECT factory_id, work_id, proc_id, equip_id, mold_id, mold_cavity, start_date, end_date, qty
    FROM ongoing 
    WHERE rn = 1;
  `;

  const createTempTableReject = `
    CREATE TEMP TABLE temp_work_reject (factory_id int, work_id int, qty numeric);
    CREATE INDEX ON temp_work_reject(work_id);

    IF ${params.opt_reject_qty} = ${PRD_METHOD_REJECT_QTY.SUM} THEN	-- 집계
      INSERT INTO temp_work_reject
      SELECT factory_id, work_id, sum(COALESCE(qty,0)) AS qty
      FROM prd_work_reject_tb 
      GROUP BY factory_id, work_id;
    
    ELSE
      WITH work_reject AS
        (
          SELECT 
            factory_id, work_id, work_routing_id, proc_no,
            rank() over(PARTITION BY factory_id, work_id ORDER BY proc_no DESC) AS rn
          FROM prd_work_routing_tb
        )
        INSERT INTO temp_work_reject
        SELECT wr.factory_id, wr.work_id, sum(COALESCE(p_wr.qty,0)) AS qty
        FROM work_reject wr
        LEFT JOIN prd_work_reject_tb p_wr ON p_wr.work_routing_id = wr.work_routing_id
        WHERE wr.rn = 1
        GROUP BY wr.factory_id, wr.work_id;
    
    END IF;
  `;

  //#region 📒 Main Query
  const createQuery = `
    SELECT 
      p_w.uuid as work_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      p_w.reg_date,
      p_o.uuid as order_uuid,
      p_o.order_no,
      p_w.seq,
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
      t_wr.mold_cavity,
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
      p_w.lot_no,
      p_o.qty as order_qty,
      (p_w.qty + p_w.reject_qty) as total_qty,
      CASE WHEN p_w.complete_fg = TRUE THEN p_w.qty ELSE t_wr.qty END as qty,
      CASE WHEN p_w.complete_fg = TRUE THEN p_w.reject_qty ELSE t_wrj.qty END as reject_qty,
      t_wr.start_date,
      t_wr.end_date,
      p_w.work_time,
      s_sf.uuid as shift_uuid,
      s_sf.shift_nm,
      s_wg.uuid as worker_group_uuid,
      s_wg.worker_group_cd,
      s_wg.worker_group_nm,
      CAST(COALESCE(p_ww.cnt,0) AS int) as worker_cnt,
      p_ww1.worker_nm,
      CASE WHEN p_w.complete_fg = TRUE THEN '완료' ELSE '미완료' END as complete_state,
      p_w.complete_fg,
      s_s.uuid as to_store_uuid,
      s_s.store_cd as to_store_cd,
      s_s.store_nm as to_store_nm,
      s_l.uuid as to_location_uuid,
      s_l.location_cd as to_location_cd,
      s_l.location_nm as to_location_nm,
      p_o.remark as order_remark,
      p_w.remark,
      p_w.created_at,
      p_w.created_uid,
      a_uc.user_nm as created_nm,
      p_w.updated_at,
      p_w.updated_uid,
      a_uu.user_nm as updated_nm
    FROM prd_work_tb p_w
    JOIN prd_order_tb p_o ON p_o.order_id = p_w.order_id
    LEFT JOIN std_worker_group_tb s_wg ON s_wg.worker_group_id = p_o.worker_group_id
    JOIN std_factory_tb s_f ON s_f.factory_id = p_w.factory_id
    JOIN std_workings_tb s_ws ON s_ws.workings_id = p_w.workings_id
    LEFT JOIN temp_work_routing t_wr on t_wr.work_id = p_w.work_id
    LEFT JOIN std_proc_tb s_pc ON s_pc.proc_id = t_wr.proc_id
    LEFT JOIN std_equip_tb s_e ON s_e.equip_id = t_wr.equip_id
    LEFT JOIN mld_mold_tb m_m ON m_m.mold_id = t_wr.mold_id
    JOIN std_prod_tb s_p ON s_p.prod_id = p_w.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    JOIN std_shift_tb s_sf ON s_sf.shift_id = p_w.shift_id
    LEFT JOIN std_store_tb s_s ON s_s.store_id = p_w.to_store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = p_w.to_location_id
    LEFT JOIN temp_work_reject t_wrj on t_wrj.work_id = p_w.work_id
    LEFT JOIN (	SELECT p_ww.work_id, count(*) AS cnt 
          FROM prd_work_worker_tb p_ww
          GROUP BY p_ww.work_id) p_ww ON p_ww.work_id = p_w.work_id
    LEFT JOIN (	SELECT p_ww.work_id, array_to_string(array_agg(s_w.worker_nm), ',', '') AS worker_nm
          FROM prd_work_worker_tb p_ww
          LEFT JOIN std_worker_tb s_w ON s_w.worker_id = p_ww.worker_id 
          GROUP BY p_ww.work_id) p_ww1 ON p_ww1.work_id = p_w.work_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_w.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_w.updated_uid
    ${searchQuery}
    ORDER BY p_w.reg_date;
  `;

  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTable = `
    DROP TABLE temp_work_routing;
    DROP TABLE temp_work_reject;
  `;

  const query = `
    DO $$
    DECLARE
      tenantOptValue int;
    
    BEGIN
      -- 작업실적 정보를 가져오기 전 작업 별 공정, 설비, 금형에 대한 데이터 셋팅
      ${createTempTableRouting}

      -- 작업실적 정보를 가져오기 전 사용자 옵션에 따른 부적합 수량 셋팅
      ${createTempTableReject}
    END $$;
    
    
    -- 작업실적 메인 조회 쿼리
    ${createQuery}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTable}
  `;
  //#endregion

  return query;
}

export { readWorks }