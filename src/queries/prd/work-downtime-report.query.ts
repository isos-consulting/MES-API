const readWorkDowntimeReport = (
  params: {
    sort_type?: 'proc' | 'equip' | 'downtime',
    work_start_date?: string,
    work_end_date?: string,
    downtime_start_date?: string,
    downtime_end_date?: string,
    factory_uuid?: string,
  }
) => {
  const createDowntimeTempTable = `
    CREATE TEMP TABLE temp_downtime(
      work_downtime_id int,
      factory_id int,
      work_id int,
      reg_date timestamp,
      proc_id int,
      workings_id int,
      equip_id int,
      prod_id int,
      lot_no varchar(25),
      work_start_date timestamp,
      work_end_date timestamp, 
      downtime_id int,
      start_date timestamp,
      end_date timestamp,
      downtime numeric,
      remark varchar(250),
      created_at timestamptz, created_uid int, created_nm varchar(20),
      updated_at timestamptz, updated_uid int, updated_nm varchar(20)
    );
  `;

  const insertDataToTempTable = `
    INSERT INTO temp_downtime
    SELECT
      p_wd.work_downtime_id,
      p_wd.factory_id,
      p_wd.work_id,
      p_w.reg_date,
      p_wr.proc_id,
      p_wr.workings_id,
      p_wr.equip_id,
      p_w.prod_id,
      p_w.lot_no,
      p_wr.start_date,
      p_wr.end_date,
      p_wd.downtime_id,
      p_wd.start_date,
      p_wd.end_date,
      p_wd.downtime,
      p_wd.remark,
      p_wd.created_at, p_wd.created_uid, a_uc.user_nm,
      p_wd.updated_at, p_wd.updated_uid, a_uu.user_nm
    FROM prd_work_downtime_tb p_wd
    JOIN std_factory_tb s_f ON s_f.factory_id = p_wd.factory_id
    JOIN prd_work_tb p_w ON p_w.work_id = p_wd.work_id 
    JOIN prd_work_routing_tb p_wr ON p_wr.work_routing_id = p_wd.work_routing_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = p_wd.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = p_wd.updated_uid
    WHERE p_w.complete_fg = TRUE
    ${params.factory_uuid ? `AND s_f.uuid = '${params.factory_uuid}'` : ''}
    ${params.work_start_date && params.work_end_date ? `AND date(p_w.reg_date) BETWEEN '${params.work_start_date}' AND '${params.work_end_date}'` : ''};
    ${params.downtime_start_date && params.downtime_end_date ? `AND date(p_wd.reg_date) BETWEEN '${params.downtime_start_date}' AND '${params.downtime_end_date}'` : ''};
  `;

  let reportOrderBy: string;
  switch (params.sort_type) {
    case 'proc': reportOrderBy = `ORDER BY t_d.proc_id`; break;
    case 'equip': reportOrderBy = `ORDER BY t_d.equip_id`; break;
    case 'downtime': reportOrderBy = `ORDER BY t_d.downtime`; break;
    default: reportOrderBy = ''; break;
  }

  const readReport = `
    SELECT
      p_wd.uuid as work_downtime_uuid,
      p_w.uuid as work_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      t_d.reg_date,
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
      t_d.lot_no,
      t_d.work_start_date,
      t_d.work_end_date,
      s_dt.uuid as downtime_type_uuid,
      s_dt.downtime_type_cd,
      s_dt.downtime_type_nm,
      s_d.uuid as downtime_uuid,
      s_d.downtime_cd,
      s_d.downtime_nm,
      t_d.start_date, 
      t_d.end_date, 
      COALESCE(t_d.downtime,0) as downtime,
      t_d.remark,
      t_d.created_at,
      t_d.created_uid,
      t_d.created_nm,
      t_d.updated_at,
      t_d.updated_uid,
      t_d.updated_nm
    FROM temp_downtime t_d
    LEFT JOIN prd_work_tb p_w ON p_w.work_id = t_d.work_id
    LEFT JOIN prd_work_downtime_tb p_wd ON p_wd.work_downtime_id = t_d.work_downtime_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_d.factory_id
    LEFT JOIN std_proc_tb s_pc ON s_pc.proc_id = t_d.proc_id
    LEFT JOIN std_workings_tb s_w ON s_w.workings_id = t_d.workings_id
    LEFT JOIN std_equip_tb s_e ON s_e.equip_id = t_d.equip_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_d.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_downtime_tb s_d ON s_d.downtime_id = t_d.downtime_id
    LEFT JOIN std_downtime_type_tb s_dt ON s_dt.downtime_type_id = s_d.downtime_type_id
    ${reportOrderBy};
  `;

  const dropTempTable = `
    DROP TABLE temp_downtime;
  `;

  const query = `
    -- 📌 비가동현황을 조회하기 위하여 임시테이블 생성
    ${createDowntimeTempTable}

    -- 📌 임시테이블에 비가동현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 비가동현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readWorkDowntimeReport }