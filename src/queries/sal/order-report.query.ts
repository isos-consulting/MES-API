const readOrderReport = (
  params: {
    complete_state?: 'all' | 'complete' | 'incomplete'
    sub_total_type?: 'partner' | 'prod' | 'date' | 'none',
    start_reg_date?: string,
    end_reg_date?: string,
    start_due_date?: string,
    end_due_date?: string,
    factory_uuid?: string,
  }
) => {
  let searchQuery: string = '';
  
  const createOrderTempTable = `
    CREATE TEMP TABLE temp_order(
      sort int, 
      order_detail_id int, 
      factory_id int, 
      reg_date timestamptz, 
      partner_id int, 
      prod_id int, 
      due_date timestamptz, 
      qty numeric, 
      price numeric,
      money_unit_id int, 
      exchange NUMERIC,
      supply_price numeric, 
      tax numeric, 
      total_price numeric, 
      outgo_qty numeric, 
      balance numeric, 
      complete_state TEXT, 
      remark varchar(250),
      created_at timestamptz, created_uid int, created_nm varchar(20), 
      updated_at timestamptz, updated_uid int, updated_nm varchar(20)
    );
  `;

  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.start_reg_date && params.end_reg_date) { searchQuery += ` AND s_o.reg_date BETWEEN '${params.start_reg_date}' AND '${params.end_reg_date}'`; }
  if (params.start_due_date && params.end_due_date) { searchQuery += ` AND s_od.due_date BETWEEN '${params.start_due_date}' AND '${params.end_due_date}'`; }

  switch (params.complete_state) {
    case 'all': break;
    case 'complete': searchQuery = searchQuery.concat(` AND ((s_od.qty <= COALESCE(s_ogd.qty, 0)) OR s_od.complete_fg = TRUE)`); break;
    case 'incomplete': searchQuery = searchQuery.concat(` AND ((s_od.qty > COALESCE(s_ogd.qty, 0)) AND s_od.complete_fg = FALSE)`); break;
    default: break;
  }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const insertDataToTempTable = `
    INSERT INTO temp_order
    SELECT 
      1, 
      s_od.order_detail_id, 
      s_od.factory_id, 
      s_o.reg_date, 
      s_o.partner_id, 
      s_od.prod_id, 
      s_od.due_date, 
      s_od.qty, 
      s_od.price, 
      s_od.money_unit_id, 
      s_od.exchange,
      s_od.total_price, 
      (s_od.total_price * 0.1), 
      s_od.total_price + (s_od.total_price * 0.1), 
      COALESCE(s_ogd.qty,0), 
      CASE WHEN (s_od.qty - COALESCE(s_ogd.qty,0)) < 0 THEN 0 ELSE (s_od.qty - COALESCE(s_ogd.qty,0)) END, 
      CASE WHEN s_od.complete_fg = FALSE AND ((s_od.qty - COALESCE(s_ogd.qty,0)) > 0) THEN '미완료' ELSE '완료' END, 
      s_od.remark,
      s_od.created_at, s_od.created_uid, a_uc.user_nm,
      s_od.updated_at, s_od.updated_uid, a_uu.user_nm
    FROM sal_order_detail_tb s_od
    JOIN std_factory_tb s_f ON s_f.factory_id = s_od.factory_id
    JOIN sal_order_tb s_o ON s_o.order_id = s_od.order_id
    LEFT JOIN (	
      SELECT s_ogd.order_detail_id, sum(COALESCE(s_ogd.qty,0)) AS qty
      FROM sal_outgo_detail_tb s_ogd
      WHERE s_ogd.order_detail_id IS NOT NULL
      GROUP BY s_ogd.order_detail_id 
    ) s_ogd ON s_ogd.order_detail_id = s_od.order_detail_id 
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = s_od.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = s_od.updated_uid
    ${searchQuery};
  `;

  let insertTotalToTempTable: string;
  let reportOrderBy: string;
  switch (params.sub_total_type) {
    case 'partner':
      insertTotalToTempTable = `
        INSERT INTO temp_order(sort, partner_id, qty, supply_price, tax, total_price, outgo_qty, balance)
        SELECT 
          CASE WHEN t_o.partner_id IS NOT NULL THEN 2 ELSE 3 END,
          t_o.partner_id, sum(t_o.qty), sum(t_o.supply_price), sum(t_o.tax), sum(t_o.total_price), sum(t_o.outgo_qty), sum(t_o.balance)
        FROM temp_order t_o
        GROUP BY ROLLUP (t_o.partner_id);
      `;

      reportOrderBy = `ORDER BY t_o.partner_id, t_o.sort;`;
      break;
    case 'prod':
      insertTotalToTempTable = `
        INSERT INTO temp_order(sort, prod_id, qty, supply_price, tax, total_price, outgo_qty, balance)
        SELECT 
          CASE WHEN t_o.prod_id IS NOT NULL THEN 2 ELSE 3 END,
          t_o.prod_id, sum(t_o.qty), sum(t_o.supply_price), sum(t_o.tax), sum(t_o.total_price), sum(t_o.outgo_qty), sum(t_o.balance)
        FROM temp_order t_o
        GROUP BY ROLLUP (t_o.prod_id);
      `;

      reportOrderBy = `ORDER BY t_o.prod_id, t_o.sort;`;
      break;
    case 'date':
      insertTotalToTempTable = `
        INSERT INTO temp_order(sort, reg_date, qty, supply_price, tax, total_price, outgo_qty, balance)
        SELECT 
          CASE WHEN t_o.reg_date IS NOT NULL THEN 2 ELSE 3 END,
          t_o.reg_date, sum(t_o.qty), sum(t_o.supply_price), sum(t_o.tax), sum(t_o.total_price), sum(t_o.outgo_qty), sum(t_o.balance)
        FROM temp_order t_o
        GROUP BY ROLLUP (t_o.reg_date);
      `;

      reportOrderBy = `ORDER BY t_o.reg_date, t_o.sort;`;
      break;
    case 'none':
      insertTotalToTempTable = `
        INSERT INTO temp_order(sort, qty, supply_price, tax, total_price, outgo_qty, balance)
        SELECT 3, sum(t_o.qty), sum(t_o.supply_price), sum(t_o.tax), sum(t_o.total_price), sum(t_o.outgo_qty), sum(t_o.balance)
        FROM temp_order t_o;
      `;

      reportOrderBy = `ORDER BY t_o.order_detail_id, t_o.sort;`;
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
      s_od.uuid as order_detail_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      t_o.reg_date,
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
      t_o.due_date,
      COALESCE(t_o.qty,0) as qty,
      t_o.price,
      s_mu.uuid as money_unit_uuid,
      s_mu.money_unit_cd,
      s_mu.money_unit_nm,
      t_o.exchange,
      COALESCE(t_o.supply_price,0) as supply_price,
      COALESCE(t_o.tax,0) as tax,
      COALESCE(t_o.total_price,0) as total_price,
      COALESCE(t_o.outgo_qty,0) as outgo_qty,
      COALESCE(t_o.balance,0) as balance,
      t_o.complete_state,
      t_o.remark,
      t_o.created_at,
      t_o.created_uid,
      t_o.created_nm,
      t_o.updated_at,
      t_o.updated_uid,
      t_o.updated_nm
    FROM temp_order t_o
    LEFT JOIN sal_order_detail_tb s_od ON s_od.order_detail_id = t_o.order_detail_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_o.factory_id
    LEFT JOIN std_partner_tb s_pn ON s_pn.partner_id = t_o.partner_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_o.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = t_o.money_unit_id
    ${reportOrderBy}
  `;

  const dropTempTable = `
    DROP TABLE temp_order;
  `;

  const query = `
    -- 📌 수주현황을 조회하기 위하여 임시테이블 생성
    ${createOrderTempTable}

    -- 📌 임시테이블에 수주현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 SubTotal 유형에 따라 합계를 계산하여 데이터 입력
    ${insertTotalToTempTable}

    -- 📌 수주현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readOrderReport }