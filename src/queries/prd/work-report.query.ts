const readWorkReport = (
  params: {
    sort_type?: 'proc' | 'prod' | 'date',
    start_date?: string,
    end_date?: string,
    factory_uuid?: string,
  }
) => {
  const createWorkTempTable = `
    /** 임시테이블 생성 */
    CREATE TEMP TABLE temp_work_routing_end(factory_id int, work_id int, proc_id int, equip_id int, mold_id int, mold_cavity int, start_date timestamp, end_date timestamp, qty numeric, reject_qty numeric);
    /** 임시테이블 인덱스 설정 */
    CREATE INDEX ON temp_work_routing_end(work_id);

    /** complete */
    -- 마감된 작업 기준으로 라우팅정보를 가져올때는 공정순서가 마지막인 공정을 가져옴
    WITH end_routing AS
    (
      SELECT 
        p_wr.factory_id, p_wr.work_id, p_wr.proc_id, p_wr.equip_id, p_wr.mold_id, p_wr.mold_cavity, p_wr.start_date, p_wr.end_date, 0::numeric as qty,
        rank() over(PARTITION BY p_wr.factory_id, p_wr.work_id ORDER BY p_wr.proc_no DESC) AS rn
      FROM prd_work_routing_tb p_wr
      JOIN prd_work_tb p_w ON p_w.work_id = p_wr.work_id 
      WHERE p_w.complete_fg = TRUE 
    )
    INSERT INTO temp_work_routing_end
    SELECT factory_id, work_id, proc_id, equip_id, mold_id, mold_cavity, start_date, end_date, qty
    FROM end_routing 
    WHERE rn = 1;
  
  
  /** 임시테이블 생성 */
    CREATE TEMP TABLE temp_work_routing_start(factory_id int, work_id int, proc_id int, equip_id int, mold_id int, mold_cavity int, start_date timestamp, end_date timestamp, qty numeric, reject_qty numeric);
    /** 임시테이블 인덱스 설정 */
    CREATE INDEX ON temp_work_routing_start(work_id);

    /** complete */
    -- 마감된 작업 기준으로 라우팅정보를 가져올때는 공정순서가 마지막인 공정을 가져옴
    WITH start_routing AS
    (
      SELECT 
        p_wr.factory_id, p_wr.work_id, p_wr.proc_id, p_wr.equip_id, p_wr.mold_id, p_wr.mold_cavity, p_wr.start_date, p_wr.end_date, 0::numeric as qty,
        rank() over(PARTITION BY p_wr.factory_id, p_wr.work_id ORDER BY p_wr.proc_no ASC) AS rn
      FROM prd_work_routing_tb p_wr
      JOIN prd_work_tb p_w ON p_w.work_id = p_wr.work_id 
      WHERE p_w.complete_fg = TRUE 
    )
    INSERT INTO temp_work_routing_start
    SELECT factory_id, work_id, proc_id, equip_id, mold_id, mold_cavity, start_date, end_date, qty
    FROM start_routing 
    WHERE rn = 1;

    -- 임시테이블 메인
    CREATE TEMP TABLE temp_work(
      work_id int,
      order_id int,
      factory_id int,
      shift_id int,
      reg_date timestamp,
      proc_id int,
      workings_id int,
      equip_id int,
      prod_id int,
      lot_no varchar(25),
      order_qty numeric,
      total_qty numeric,
      qty numeric,
      reject_qty numeric,
      start_date timestamp,
      end_date timestamp, 
      to_store_id int,
      to_location_id int,
      remark varchar(250),
      created_at timestamptz, created_uid int, created_nm varchar(20),
      updated_at timestamptz, updated_uid int, updated_nm varchar(20)
    );
  `;

  const insertDataToTempTable = `
    INSERT INTO temp_work
    SELECT 
      p_w.work_id,
      p_w.order_id,
      p_w.factory_id,
      p_w.shift_id,
      p_w.reg_date,
      t_wre.proc_id,
      p_w.workings_id,
      t_wre.equip_id,
      p_w.prod_id,
      p_w.lot_no,
      COALESCE(p_o.qty, 0),
      COALESCE(p_w.qty, 0)+ COALESCE(p_w.reject_qty, 0),
      COALESCE(p_w.qty, 0),
      COALESCE(p_w.reject_qty, 0),
      t_wrs.start_date,
      t_wre.end_date,
      p_w.to_store_id,
      p_w.to_location_id,
      p_w.remark,
      p_w.created_at, p_w.created_uid, a_uc.user_nm,
      p_w.updated_at, p_w.updated_uid, a_uu.user_nm
    FROM prd_work_tb p_w
    JOIN prd_order_tb p_o ON p_o.order_id = p_w.order_id
    JOIN temp_work_routing_start t_wrs ON t_wrs.work_id = p_w.work_id
    JOIN temp_work_routing_end t_wre ON t_wre.work_id = p_w.work_id
    JOIN std_factory_tb s_f ON s_f.factory_id = p_w.factory_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_w.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_w.updated_uid
    WHERE p_w.complete_fg = TRUE
    ${params.factory_uuid ? `AND s_f.uuid = '${params.factory_uuid}'` : ''}
    ${params.start_date && params.end_date ? `AND date(p_w.reg_date) BETWEEN '${params.start_date}' AND '${params.end_date}'` : ''};
  `;

  let reportOrderBy: string;
  switch (params.sort_type) {
    case 'proc': reportOrderBy = `ORDER BY t_w.proc_id`; break;
    case 'prod': reportOrderBy = `ORDER BY t_w.prod_id`; break;
    case 'date': reportOrderBy = `ORDER BY t_w.reg_date`; break;
    default: reportOrderBy = ''; break;
  }

  const readReport = `
    SELECT
      p_w.uuid as work_uuid,
      p_o.uuid as order_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      s_s.uuid as shift_uuid,
      s_s.shift_nm,
      t_w.reg_date,
      s_pc.uuid as proc_uuid,
      s_pc.proc_cd,
      s_pc.proc_nm,
      s_w.uuid as workings_uuid,
      s_w.workings_cd,
      s_w.workings_nm,
      s_e.uuid as equip_uuid,
      s_e.equip_cd,
      s_e.equip_nm,
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
      t_w.lot_no,
      COALESCE(t_w.order_qty,0) as order_qty,
      COALESCE(t_w.total_qty,0) as total_qty,
      COALESCE(t_w.qty,0) as qty,
      COALESCE(t_w.reject_qty,0) as reject_qty,
      t_w.start_date,
      t_w.end_date,
      t_ss.uuid as to_store_uuid,
      t_ss.store_cd as to_store_cd,
      t_ss.store_nm as to_store_nm,
      t_ls.uuid as to_location_uuid,
      t_ls.location_cd as to_location_cd,
      t_ls.location_nm as to_location_nm,
      t_w.remark,
      t_w.created_at,
      t_w.created_uid,
      t_w.created_nm,
      t_w.updated_at,
      t_w.updated_uid,
      t_w.updated_nm
    FROM temp_work t_w
    LEFT JOIN prd_work_tb p_w ON p_w.work_id = t_w.work_id
    LEFT JOIN prd_order_tb p_o ON p_o.order_id = t_w.order_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_w.factory_id
    LEFT JOIN std_proc_tb s_pc ON s_pc.proc_id = t_w.proc_id
    LEFT JOIN std_workings_tb s_w ON s_w.workings_id = t_w.workings_id
    LEFT JOIN std_equip_tb s_e ON s_e.equip_id = t_w.equip_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_w.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_shift_tb s_s ON s_s.shift_id = t_w.shift_id
    LEFT JOIN std_store_tb t_ss ON t_ss.store_id = t_w.to_store_id
    LEFT JOIN std_location_tb t_ls ON t_ls.location_id = t_w.to_location_id
    ${reportOrderBy};
  `;

  const dropTempTable = `
    DROP TABLE temp_work_routing_start;
    DROP TABLE temp_work_routing_end;
    DROP TABLE temp_work;
  `;

  const query = `
    -- 📌 실적현황을 조회하기 위하여 임시테이블 생성
    ${createWorkTempTable}

    -- 📌 임시테이블에 실적현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 실적현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readWorkReport }