const readReceiveReport = (
  params: {
    sort_type?: 'partner' | 'prod' | 'date',
    start_reg_date?: string,
    end_reg_date?: string,
    start_due_date?: string,
    end_due_date?: string,
    factory_uuid?: string,
  }
) => {
  let searchQuery: string = '';
  
  const createReceiveTempTable = `
    CREATE TEMP TABLE temp_receive(
      receive_detail_id int, 
      factory_id int, 
      reg_date timestamp, 
      partner_id int, 
      prod_id int, 
      order_qty numeric, 
      lot_no varchar(25), 
      qty numeric, 
      price numeric,
      money_unit_id int,
      exchange NUMERIC, 
      supply_price numeric, 
      tax numeric, 
      total_price numeric, 
      income_qty NUMERIC, 
      insp_state TEXT, 
      insp_result_state TEXT, 
      reject_qty numeric, 
      remark varchar(250),
      created_at timestamptz, created_uid int, created_nm varchar(20), 
      updated_at timestamptz, updated_uid int, updated_nm varchar(20)
    );
  `;

  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.start_reg_date && params.end_reg_date) { searchQuery += ` AND date(o_r.reg_date) BETWEEN '${params.start_reg_date}' AND '${params.end_reg_date}'`; }
  if (params.start_due_date && params.end_due_date) { searchQuery += ` AND date(m_od.due_date) BETWEEN '${params.start_due_date}' AND '${params.end_due_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const insertDataToTempTable = `
    INSERT INTO temp_receive
    SELECT 
      o_rd.receive_detail_id, 
      o_rd.factory_id, 
      o_r.reg_date, 
      o_r.partner_id, 
      o_rd.prod_id, 
      COALESCE(m_od.qty,0), 
      o_rd.lot_no,
      o_rd.qty, 
      o_rd.price, 
      o_rd.money_unit_id, 
      o_rd.exchange, 
      o_rd.total_price, 
      (o_rd.total_price * 0.1), 
      o_rd.total_price + (o_rd.total_price * 0.1), 
      COALESCE(o_i.qty,0), 
      CASE WHEN insp_fg = FALSE THEN '무검사' 
      ELSE CASE WHEN q_ir.insp_result_id IS NULL THEN '미완료' ELSE '완료' END END,
      CASE WHEN insp_fg = FALSE OR (insp_fg = TRUE AND q_ir.insp_result_fg IS NULL) THEN ''
      ELSE CASE WHEN q_ir.insp_result_fg = FALSE THEN '불합격' ELSE '합격' END END,
      COALESCE(q_ir.reject_qty,0), 
      o_rd.remark,
      o_rd.created_at, o_rd.created_uid, a_uc.user_nm,
      o_rd.updated_at, o_rd.updated_uid, a_uu.user_nm
    FROM out_receive_detail_tb o_rd
    JOIN std_factory_tb s_f ON s_f.factory_id = o_rd.factory_id
    JOIN out_receive_tb o_r ON o_r.receive_id = o_rd.receive_id
    LEFT JOIN mat_order_detail_tb m_od ON m_od.order_detail_id = o_rd.order_detail_id
    LEFT JOIN out_income_tb o_i ON o_i.receive_detail_id = o_rd.receive_detail_id
    LEFT JOIN qms_insp_result_tb q_ir ON q_ir.insp_reference_id = o_rd.receive_detail_id AND q_ir.insp_detail_type_cd = 'MAT_RECEIVE'
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = o_rd.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = o_rd.updated_uid
    ${searchQuery};
  `;

  let reportOrderBy: string;
  switch (params.sort_type) {
    case 'partner': reportOrderBy = `ORDER BY t_r.partner_id`; break;
    case 'prod': reportOrderBy = `ORDER BY t_r.prod_id`; break;
    case 'date': reportOrderBy = `ORDER BY t_r.reg_date`; break;
    default: reportOrderBy = ''; break;
  }

  const readReport = `
    SELECT
      o_rd.uuid as receive_detail_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      t_r.reg_date,
      s_pn.uuid as partner_uuid,
      s_pn.partner_cd,
      s_pn.partner_nm,
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
      COALESCE(t_r.order_qty,0) as order_qty,
      t_r.lot_no,
      o_rd.manufactured_lot_no,
      COALESCE(t_r.qty,0) as qty,
      t_r.price,
      s_mu.uuid as money_unit_uuid,
      s_mu.money_unit_cd,
      s_mu.money_unit_nm,
      t_r.exchange,
      COALESCE(t_r.supply_price,0) as supply_price,
      COALESCE(t_r.tax,0) as tax,
      COALESCE(t_r.total_price,0) as total_price,
      COALESCE(t_r.income_qty,0) as income_qty, 
      t_r.insp_state, 
      t_r.insp_result_state, 
      COALESCE(t_r.reject_qty,0) as reject_qty,
      t_r.remark,
      t_r.created_at,
      t_r.created_uid,
      t_r.created_nm,
      t_r.updated_at,
      t_r.updated_uid,
      t_r.updated_nm
    FROM temp_receive t_r
    LEFT JOIN out_receive_detail_tb o_rd ON o_rd.receive_detail_id = t_r.receive_detail_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_r.factory_id
    LEFT JOIN std_partner_tb s_pn ON s_pn.partner_id = t_r.partner_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_r.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = o_rd.unit_id
    LEFT JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = t_r.money_unit_id
    ${reportOrderBy};
  `;

  const dropTempTable = `
    DROP TABLE temp_receive;
  `;

  const query = `
    -- 📌 외주입하현황을 조회하기 위하여 임시테이블 생성
    ${createReceiveTempTable}

    -- 📌 임시테이블에 외주입하현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 외주입하현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readReceiveReport }