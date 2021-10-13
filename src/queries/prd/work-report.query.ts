const readWorkReport = (
  params: {
    sub_total_type?: 'proc' | 'prod' | 'date' | 'none',
    start_date?: string,
    end_date?: string,
    factory_uuid?: string,
  }
) => {
  const createWorkTempTable = `
    CREATE TEMP TABLE temp_work(
      sort int,
      work_id int,
      order_id int,
      factory_id int,
      shift_id int,
      reg_date timestamptz,
      proc_id int,
      workings_id int,
      equip_id int,
      prod_id int,
      lot_no varchar(25),
      order_qty numeric,
      total_qty numeric,
      qty numeric,
      reject_qty numeric,
      start_date timestamptz,
      end_date timestamptz, 
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
      1,
      p_w.work_id,
      p_w.order_id,
      p_w.factory_id,
      p_w.shift_id,
      p_w.reg_date,
      p_w.proc_id,
      p_w.workings_id,
      p_w.equip_id,
      p_w.prod_id,
      p_w.lot_no,
      COALESCE(p_o.qty, 0),
      COALESCE(p_w.qty, 0)+ COALESCE(p_w.reject_qty, 0),
      COALESCE(p_w.qty, 0),
      COALESCE(p_w.reject_qty, 0),
      p_w.start_date,
      p_w.end_date,
      p_w.to_store_id,
      p_w.to_location_id,
      p_w.remark,
      p_w.created_at, p_w.created_uid, a_uc.user_nm,
      p_w.updated_at, p_w.updated_uid, a_uu.user_nm
    FROM prd_work_tb p_w
    JOIN prd_order_tb p_o ON p_o.order_id = p_w.order_id
    JOIN std_factory_tb s_f ON s_f.factory_id = p_w.factory_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_w.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_w.updated_uid
    WHERE p_w.complete_fg = TRUE
    ${params.factory_uuid ? `AND s_f.uuid = '${params.factory_uuid}'` : ''}
    ${params.start_date && params.end_date ? `AND date(p_w.reg_date) BETWEEN '${params.start_date}' AND '${params.end_date}'` : ''};
  `;

  let insertTotalToTempTable: string;
  let reportOrderBy: string;
  switch (params.sub_total_type) {
    case 'proc':
      insertTotalToTempTable = `
        INSERT INTO temp_work(sort, proc_id, order_qty, total_qty, qty, reject_qty)
        SELECT 
          CASE WHEN t_w.proc_id IS NOT NULL THEN 2 ELSE 3 END,
          t_w.proc_id, sum(t_w.order_qty), sum(t_w.total_qty), sum(t_w.qty), sum(t_w.reject_qty)
        FROM temp_work t_w
        GROUP BY ROLLUP (t_w.proc_id);
      `;

      reportOrderBy = `ORDER BY t_w.proc_id, t_w.sort;`;
      break;
    case 'prod':
      insertTotalToTempTable = `
        INSERT INTO temp_work(sort, prod_id, order_qty, total_qty, qty, reject_qty)
        SELECT 
          CASE WHEN t_w.prod_id IS NOT NULL THEN 2 ELSE 3 END,
          t_w.prod_id, sum(t_w.order_qty), sum(t_w.total_qty), sum(t_w.qty), sum(t_w.reject_qty)
        FROM temp_work t_w
        GROUP BY ROLLUP (t_w.prod_id);
      `;

      reportOrderBy = `ORDER BY t_w.prod_id, t_w.sort;`;
      break;
    case 'date':
      insertTotalToTempTable = `
        INSERT INTO temp_work(sort, reg_date, order_qty, total_qty, qty, reject_qty)
        SELECT 
          CASE WHEN t_w.reg_date IS NOT NULL THEN 2 ELSE 3 END,
          t_w.reg_date, sum(t_w.order_qty), sum(t_w.total_qty), sum(t_w.qty), sum(t_w.reject_qty)
        FROM temp_work t_w
        GROUP BY ROLLUP (t_w.reg_date);
      `;

      reportOrderBy = `ORDER BY t_w.reg_date, t_w.sort;`;
      break;
    case 'none':
      insertTotalToTempTable = `
        INSERT INTO temp_work(sort, order_qty, total_qty, qty, reject_qty)
        SELECT 3, sum(t_w.order_qty), sum(t_w.total_qty), sum(t_w.qty), sum(t_w.reject_qty)
        FROM temp_work t_w;
      `;

      reportOrderBy = `ORDER BY t_w.work_id, t_w.sort;`;
      break;
    default: 
      insertTotalToTempTable = '';
      reportOrderBy = '';
      break;
  }

  const readReport = `
    SELECT
      CASE WHEN sort = 2 THEN 'sub-total'
        WHEN sort = 3 THEN 'total' ELSE 'data' END as row_type,
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
    ${reportOrderBy}
  `;

  const dropTempTable = `
    DROP TABLE temp_work;
  `;

  const query = `
    -- 📌 실적현황을 조회하기 위하여 임시테이블 생성
    ${createWorkTempTable}

    -- 📌 임시테이블에 실적현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 SubTotal 유형에 따라 합계를 계산하여 데이터 입력
    ${insertTotalToTempTable}

    -- 📌 실적현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readWorkReport }