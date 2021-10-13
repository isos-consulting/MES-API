const readWorkRejectReport = (
  params: {
    sub_total_type?: 'proc' | 'prod' | 'reject' | 'none',
    start_date?: string,
    end_date?: string,
    factory_uuid?: string,
  }
) => {
  const createWorkRejectTempTable = `
    CREATE TEMP TABLE temp_reject(
      sort int,
      work_reject_id int,
      factory_id int,
      work_id int,
      reg_date timestamptz,
      proc_id int,
      workings_id int,
      equip_id int,
      prod_id int,
      lot_no varchar(25),
      total_qty numeric,
      qty numeric,
      reject_qty numeric,
      start_date timestamptz,
      end_date timestamptz, 
      reject_id int,
      reject_proc_id int,
      reject_detail_qty numeric,
      remark varchar(250),
      created_at timestamptz, created_uid int, created_nm varchar(20),
      updated_at timestamptz, updated_uid int, updated_nm varchar(20)
    );
  `;

  const insertDataToTempTable = `
    INSERT INTO temp_reject
    SELECT 
      1,
      p_wr.work_reject_id,
      p_wr.factory_id,
      p_w.work_id,
      p_w.reg_date,
      p_w.proc_id,
      p_w.workings_id,
      p_w.equip_id,
      p_w.prod_id,
      p_w.lot_no,
      COALESCE(p_w.qty, 0)+ COALESCE(p_w.reject_qty, 0),
      COALESCE(p_w.qty, 0),
      COALESCE(p_w.reject_qty, 0),
      p_w.start_date,
      p_w.end_date,
      p_wr.reject_id,
      COALESCE(p_wr.proc_id, 0),
      p_wr.qty,
      p_wr.remark,
      p_wr.created_at, p_wr.created_uid, a_uc.user_nm,
      p_wr.updated_at, p_wr.updated_uid, a_uu.user_nm
    FROM prd_work_reject_tb p_wr
    JOIN std_factory_tb s_f ON s_f.factory_id = p_wr.factory_id
    JOIN prd_work_tb p_w ON p_w.work_id = p_wr.work_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_wr.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_wr.updated_uid
    WHERE p_w.complete_fg = TRUE
    ${params.factory_uuid ? `AND s_f.uuid = '${params.factory_uuid}'` : ''}
    ${params.start_date && params.end_date ? `AND date(p_w.reg_date) BETWEEN '${params.start_date}' AND '${params.end_date}'` : ''};
  `;

  let insertTotalToTempTable: string;
  let reportOrderBy: string;
  switch (params.sub_total_type) {
    case 'proc':
      insertTotalToTempTable = `
        INSERT INTO temp_reject(sort, reject_proc_id, reject_detail_qty)
        SELECT 
          CASE WHEN t_r.reject_proc_id IS NOT NULL THEN 2 ELSE 3 END,
          t_r.reject_proc_id, sum(t_r.reject_detail_qty)
        FROM temp_reject t_r
        GROUP BY ROLLUP (t_r.reject_proc_id);
      `;

      reportOrderBy = `ORDER BY t_r.reject_proc_id, t_r.sort;`;
      break;
    case 'prod':
      insertTotalToTempTable = `
        INSERT INTO temp_reject(sort, prod_id, reject_detail_qty)
        SELECT 
          CASE WHEN t_r.prod_id IS NOT NULL THEN 2 ELSE 3 END,
          t_r.prod_id, sum(t_r.reject_detail_qty)
        FROM temp_reject t_r
        GROUP BY ROLLUP (t_r.prod_id);
      `;

      reportOrderBy = `ORDER BY t_r.prod_id, t_r.sort;`;
      break;
    case 'reject':
      insertTotalToTempTable = `
        INSERT INTO temp_reject(sort, reject_id, reject_detail_qty)
        SELECT 
          CASE WHEN t_r.reject_id IS NOT NULL THEN 2 ELSE 3 END,
          t_r.reject_id, sum(t_r.reject_detail_qty)
        FROM temp_reject t_r
        GROUP BY ROLLUP (t_r.reject_id);
      `;

      reportOrderBy = `ORDER BY t_r.reg_date, t_r.sort;`;
      break;
    case 'none':
      insertTotalToTempTable = `
        INSERT INTO temp_reject(sort, reject_detail_qty)
        SELECT 3, sum(t_r.reject_detail_qty)
        FROM temp_reject t_r;
      `;

      reportOrderBy = `ORDER BY t_r.work_reject_id, t_r.sort;`;
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
      p_wr.uuid as work_reject_uuid,
      p_w.uuid as work_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      t_r.reg_date,
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
      t_r.lot_no,
      COALESCE(t_r.total_qty,0) as total_qty,
      COALESCE(t_r.qty,0) as qty,
      COALESCE(t_r.reject_qty,0) as reject_qty,
      t_r.start_date,
      t_r.end_date,
      s_pcr.uuid as reject_proc_uuid,
      s_pcr.proc_cd as reject_proc_cd,
      s_pcr.proc_nm as reject_proc_nm,
      s_rt.uuid as reject_type_uuid,
      s_rt.reject_type_cd,
      s_rt.reject_type_nm,
      s_r.uuid as reject_uuid,
      s_r.reject_cd,
      s_r.reject_nm,
      COALESCE(t_r.reject_detail_qty,0) as reject_detail_qty,
      t_r.remark,
      t_r.created_at,
      t_r.created_uid,
      t_r.created_nm,
      t_r.updated_at,
      t_r.updated_uid,
      t_r.updated_nm
    FROM temp_reject t_r
    LEFT JOIN prd_work_reject_tb p_wr ON p_wr.work_reject_id = t_r.work_reject_id
    LEFT JOIN prd_work_tb p_w ON p_w.work_id = t_r.work_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_r.factory_id
    LEFT JOIN std_proc_tb s_pc ON s_pc.proc_id = t_r.proc_id
    LEFT JOIN std_workings_tb s_w ON s_w.workings_id = t_r.workings_id
    LEFT JOIN std_equip_tb s_e ON s_e.equip_id = t_r.equip_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_r.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_reject_tb s_r ON s_r.reject_id = t_r.reject_id
    LEFT JOIN std_reject_type_tb s_rt ON s_rt.reject_type_id = s_r.reject_type_id 
    LEFT JOIN std_proc_tb s_pcr ON s_pcr.proc_id = t_r.reject_proc_id
    ${reportOrderBy}
  `;

  const dropTempTable = `
    DROP TABLE temp_reject;
  `;

  const query = `
    -- 📌 부적합현황을 조회하기 위하여 임시테이블 생성
    ${createWorkRejectTempTable}

    -- 📌 임시테이블에 부적합현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 SubTotal 유형에 따라 합계를 계산하여 데이터 입력
    ${insertTotalToTempTable}

    -- 📌 부적합현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readWorkRejectReport }