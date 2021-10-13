const readOutgoReport = (
  params: {
    sub_total_type?: 'partner' | 'prod' | 'date' | 'none',
    start_date?: string,
    end_date?: string,
    factory_uuid?: string,
  }
) => {
  let searchQuery: string = '';
  
  const createOutgoTempTable = `
    CREATE TEMP TABLE temp_outgo(
      sort int, 
      outgo_detail_id int, 
      factory_id int, 
      reg_date timestamptz, 
      partner_id int, 
      prod_id int, 
      order_qty numeric, 
      outgo_order_qty numeric, 
      lot_no varchar(25), 
      qty numeric, 
      price numeric,
      money_unit_id int, 
      exchange numeric, 
      supply_price numeric, 
      tax numeric, 
      total_price numeric, 
      from_store_id int, 
      from_location_id int, 
      remark varchar(250),
      created_at timestamptz, created_uid int, created_nm varchar(20), 
      updated_at timestamptz, updated_uid int, updated_nm varchar(20)
    );
  `;

  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.start_date && params.end_date) { searchQuery += ` AND s_og.reg_date BETWEEN '${params.start_date}' AND '${params.end_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const insertDataToTempTable = `
    INSERT INTO temp_outgo
    SELECT 
      1, 
      s_ogd.outgo_detail_id, 
      s_ogd.factory_id, 
      s_og.reg_date, 
      s_og.partner_id, 
      s_ogd.prod_id, 
      s_od.qty, 
      s_ood.qty, 
      s_ogd.lot_no, 
      s_ogd.qty, 
      s_ogd.price, 
      s_ogd.money_unit_id, 
      s_ogd.exchange, 
      s_ogd.total_price, 
      (s_ogd.total_price * 0.1), 
      s_ogd.total_price + (s_ogd.total_price * 0.1), 
      s_ogd.from_store_id, 
      s_ogd.from_location_id, 
      s_ogd.remark,
      s_ogd.created_at, s_ogd.created_uid, a_uc.user_nm,
      s_ogd.updated_at, s_ogd.updated_uid, a_uu.user_nm
    FROM sal_outgo_detail_tb s_ogd
    JOIN std_factory_tb s_f ON s_f.factory_id = s_ogd.factory_id
    JOIN sal_outgo_tb s_og ON s_og.outgo_id = s_ogd.outgo_id
    LEFT JOIN (	
      SELECT s_od.order_detail_id, sum(COALESCE(s_od.qty,0)) AS qty
      FROM sal_order_detail_tb s_od
      WHERE s_od.order_detail_id IS NOT NULL
      GROUP BY s_od.order_detail_id 
    ) s_od ON s_od.order_detail_id = s_ogd.order_detail_id 
    LEFT JOIN (	
      SELECT s_ood.outgo_order_detail_id, sum(COALESCE(s_ood.qty,0)) AS qty
      FROM sal_outgo_order_detail_tb s_ood
      WHERE s_ood.outgo_order_detail_id IS NOT NULL
      GROUP BY s_ood.outgo_order_detail_id 
    ) s_ood ON s_ood.outgo_order_detail_id = s_ogd.outgo_order_detail_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = s_ogd.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = s_ogd.updated_uid
    ${searchQuery};
  `;

  let insertTotalToTempTable: string;
  let reportOrderBy: string;
  switch (params.sub_total_type) {
    case 'partner':
      insertTotalToTempTable = `
        INSERT INTO temp_outgo(sort, partner_id, order_qty, outgo_order_qty, qty, supply_price, tax, total_price)
        SELECT 
          CASE WHEN t_o.partner_id IS NOT NULL THEN 2 ELSE 3 END,
          t_o.partner_id, sum(t_o.order_qty), sum(t_o.outgo_order_qty), sum(t_o.qty), sum(t_o.supply_price), sum(t_o.tax), sum(t_o.total_price)
        FROM temp_outgo t_o
        GROUP BY ROLLUP (t_o.partner_id);
      `;

      reportOrderBy = `ORDER BY t_o.partner_id, t_o.sort;`;
      break;
    case 'prod':
      insertTotalToTempTable = `
        INSERT INTO temp_outgo(sort, prod_id, order_qty, outgo_order_qty, qty, supply_price, tax, total_price)
        SELECT 
          CASE WHEN t_o.prod_id IS NOT NULL THEN 2 ELSE 3 END,
          t_o.prod_id, sum(t_o.order_qty), sum(t_o.outgo_order_qty), sum(t_o.qty), sum(t_o.supply_price), sum(t_o.tax), sum(t_o.total_price)
        FROM temp_outgo t_o
        GROUP BY ROLLUP (t_o.prod_id);
      `;

      reportOrderBy = `ORDER BY t_o.prod_id, t_o.sort;`;
      break;
    case 'date':
      insertTotalToTempTable = `
        INSERT INTO temp_outgo(sort, reg_date, order_qty, outgo_order_qty, qty, supply_price, tax, total_price)
        SELECT 
          CASE WHEN t_o.reg_date IS NOT NULL THEN 2 ELSE 3 END,
          t_o.reg_date, sum(t_o.order_qty), sum(t_o.outgo_order_qty), sum(t_o.qty), sum(t_o.supply_price), sum(t_o.tax), sum(t_o.total_price)
        FROM temp_outgo t_o
        GROUP BY ROLLUP (t_o.reg_date);
      `;

      reportOrderBy = `ORDER BY t_o.reg_date, t_o.sort;`;
      break;
    case 'none':
      insertTotalToTempTable = `
        INSERT INTO temp_outgo(sort, order_qty, outgo_order_qty, qty, supply_price, tax, total_price)
        SELECT 3, sum(t_o.order_qty), sum(t_o.outgo_order_qty), sum(t_o.qty), sum(t_o.supply_price), sum(t_o.tax), sum(t_o.total_price)
        FROM temp_outgo t_o;
      `;

      reportOrderBy = `ORDER BY t_o.outgo_detail_id, t_o.sort;`;
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
      s_ogd.uuid as outgo_detail_uuid,
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
      COALESCE(t_o.order_qty,0) as order_qty,
      COALESCE(t_o.outgo_order_qty,0) as outgo_order_qty,
      t_o.lot_no,
      COALESCE(t_o.qty,0) as qty,
      t_o.price,
      s_mu.uuid as money_unit_uuid,
      s_mu.money_unit_cd,
      s_mu.money_unit_nm,
      t_o.exchange,
      COALESCE(t_o.supply_price,0) as supply_price,
      COALESCE(t_o.tax,0) as tax,
      COALESCE(t_o.total_price,0) as total_price,
      f_ss.uuid as from_store_uuid,
      f_ss.store_cd as from_store_cd,
      f_ss.store_nm as from_store_nm,
      f_sl.uuid as from_location_uuid,
      f_sl.location_cd as from_location_cd,
      f_sl.location_nm as from_location_nm,
      t_o.remark,
      t_o.created_at,
      t_o.created_uid,
      t_o.created_nm,
      t_o.updated_at,
      t_o.updated_uid,
      t_o.updated_nm
    FROM temp_outgo t_o
    LEFT JOIN sal_outgo_detail_tb s_ogd ON s_ogd.outgo_detail_id = t_o.outgo_detail_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_o.factory_id
    LEFT JOIN std_partner_tb s_pn ON s_pn.partner_id = t_o.partner_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_o.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = t_o.money_unit_id
    LEFT JOIN std_store_tb f_ss ON f_ss.store_id = t_o.from_store_id
    LEFT JOIN std_location_tb f_sl ON f_sl.location_id = t_o.from_location_id
    ${reportOrderBy}
  `;

  const dropTempTable = `
    DROP TABLE temp_outgo;
  `;

  const query = `
    -- 📌 제품출하현황을 조회하기 위하여 임시테이블 생성
    ${createOutgoTempTable}

    -- 📌 임시테이블에 제품출하현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 SubTotal 유형에 따라 합계를 계산하여 데이터 입력
    ${insertTotalToTempTable}

    -- 📌 제품출하현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readOutgoReport }