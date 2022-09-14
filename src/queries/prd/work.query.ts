import TTenantOpt from "../../types/tenant-opt.type";

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
  // if (params.order_uuid) { searchQuery += ` AND p_o.uuid = '${params.order_uuid}'`; }
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  // if (params.prod_uuid) { searchQuery += ` AND s_p.uuid = '${params.prod_uuid}'`; }
  if (params.complete_fg != null) { searchQuery += ` AND p_w.complete_fg = ${params.complete_fg}`; }
  if (params.start_date && params.end_date) { searchQuery += ` AND date(p_w.reg_date) BETWEEN '${params.start_date}' AND '${params.end_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const createTempTableRouting = `
		-- 작업실적 정보를 가져오기 전 작업 별 공정, 설비, 금형에 대한 데이터 셋팅

		/** 임시테이블 생성 */
		CREATE TEMP TABLE temp_work_routing_proc(work_id int, proc_id int);
		/** 임시테이블 인덱스 설정 */
		CREATE INDEX ON temp_work_routing_proc(work_id);

		INSERT INTO temp_work_routing_proc
		SELECT DISTINCT p_w.work_id, COALESCE(p_wr.proc_id, p_wro.proc_id) AS proc_id
		FROM prd_work_tb p_w 
		JOIN std_factory_tb s_f ON s_f.factory_id = p_w.factory_id 
		LEFT JOIN (	SELECT p_wr.work_id, p_wr.proc_id 
					FROM ( 	SELECT rank() over(PARTITION BY p_wr.factory_id, p_wr.work_id ORDER BY p_wr.proc_no DESC) AS rn, *
							FROM prd_work_routing_tb p_wr
							WHERE p_wr.complete_fg = FALSE ) p_wr
					WHERE p_wr.rn = 1) p_wr ON p_wr.work_id = p_w.work_id 
		LEFT JOIN ( SELECT p_wro.work_id, p_wro.proc_id 
					FROM ( 	SELECT rank() over(PARTITION BY factory_id, work_id ORDER BY proc_no ASC) AS rn, *
							FROM prd_work_routing_origin_tb ) p_wro 
					WHERE p_wro.rn = 1 ) p_wro ON p_wro.work_id = p_w.work_id 
		${searchQuery};
  `;

  //#region 📒 Main Query
  const createQuery = `
	-- 작업실적 메인 조회 쿼리

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
			s_sf.uuid as shift_uuid,
			s_sf.shift_nm,
			CASE WHEN p_w.complete_fg = TRUE THEN '완료' ELSE '미완료' END as complete_state,
			p_w.complete_fg,
			s_s.uuid as to_store_uuid,
			s_s.store_cd as to_store_cd,
			s_s.store_nm as to_store_nm,
			s_l.uuid as to_location_uuid,
			s_l.location_cd as to_location_cd,
			s_l.location_nm as to_location_nm,
			p_o.priority as priority,
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
		JOIN std_factory_tb s_f ON s_f.factory_id = p_w.factory_id
		JOIN std_workings_tb s_ws ON s_ws.workings_id = p_w.workings_id
		LEFT JOIN temp_work_routing_proc t_wrp on t_wrp.work_id = p_w.work_id
		LEFT JOIN std_proc_tb s_pc ON s_pc.proc_id = t_wrp.proc_id
		JOIN std_prod_tb s_p ON s_p.prod_id = p_w.prod_id
		LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
		LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
		LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
		LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
		JOIN std_shift_tb s_sf ON s_sf.shift_id = p_w.shift_id
		LEFT JOIN std_store_tb s_s ON s_s.store_id = p_w.to_store_id
		LEFT JOIN std_location_tb s_l ON s_l.location_id = p_w.to_location_id
		LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_w.created_uid
		LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_w.updated_uid
		${searchQuery}
		ORDER BY p_w.reg_date;
  `;

  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTable = `
		DROP TABLE temp_work_routing_proc;
  `;

  const query = `
    DO $$
    DECLARE
      tenantOptValue int;
    
    BEGIN
      -- 작업실적 정보를 가져오기 전 작업 별 공정, 설비, 금형에 대한 데이터 셋팅
      ${createTempTableRouting}
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