const readStocks = (
  params: {
    reg_date: string,
    stock_type: 'all' | 'available' | 'reject' | 'return' | 'outgo' | 'finalInsp',
    grouped_type: 'all' | 'factory' | 'store' | 'lotNo' | 'location',
    price_type?: 'purchase' | 'sales',
    exclude_zero_fg?: boolean,
    exclude_minus_fg?: boolean,
    partner_uuid?: string,
    factory_uuid?: string,
    store_uuid?: string,
    location_uuid?: string,
    prod_uuid?: string,
    reject_uuid?: string,
    lot_no?: string,
  }) => {
  let searchQuery: string = '';

  //#region 📌 전체 재고 조회
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.store_uuid) { searchQuery += ` AND s_s.uuid = '${params.store_uuid}'`; }
  if (params.location_uuid) { searchQuery += ` AND s_l.uuid = '${params.location_uuid}'`; }
  if (params.prod_uuid) { searchQuery += ` AND s_p.uuid = '${params.prod_uuid}'`; }
  if (params.reject_uuid) { searchQuery += ` AND s_r.uuid = '${params.reject_uuid}'`; }
  if (params.lot_no) { searchQuery += ` AND i_s.lot_no = '${params.lot_no}'`; }

  let searchStoreQuery: string = '';
  switch (params.stock_type) {
    case 'all':
      break;
    case 'available':
      searchStoreQuery = 'AND s_s.available_store_fg = TRUE'
      break;
    case 'reject':
      searchStoreQuery = 'AND s_s.reject_store_fg = TRUE'
      break;
    case 'return':
      searchStoreQuery = 'AND s_s.return_store_fg = TRUE'
      break;
    case 'outgo':
      searchStoreQuery = 'AND s_s.outgo_store_fg = TRUE'
      break;
    case 'finalInsp':
      searchStoreQuery = 'AND s_s.final_insp_store_fg = TRUE'
      break;
    default:
      break;
  }

  // 📌 공장(Factory), 창고(Store), 위치(Location), 품목(Prod), LotNo를 기준으로 재고를 가지고 있는 기준 임시 테이블 생성
  // 📌 재고 유형(stockType) 에 따라 Filtering 
  // 📌 [가용재고(Available), Reject(부적합재고), Return(반출대기재고), Outgo(출하대기재고)] 에 따라 Filtering
  const createBaseTempTableQuery = `
    CREATE TEMP TABLE temp_base_store(
      factory_uuid uuid,
      factory_id int,
      prod_id int,
      reject_id int,
      lot_no varchar(25),
      qty numeric(19, 6),
      store_id int,
      location_id int
    );
    CREATE INDEX ON temp_base_store(prod_id, lot_no);

    INSERT INTO temp_base_store
    SELECT
      s_f.uuid,
      i_s.factory_id,
      i_s.prod_id,
      i_s.reject_id,
      i_s.lot_no,
      sum(CASE WHEN i_s.inout_fg = FALSE THEN COALESCE(i_s.qty,0) * -1 ELSE COALESCE(i_s.qty,0) END) AS qty,
      i_s.store_id,
      i_s.location_id
    FROM inv_store_tb i_s
    JOIN std_factory_tb s_f ON s_f.factory_id = i_s.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = i_s.prod_id
    JOIN std_store_tb s_s ON s_s.store_id = i_s.store_id ${searchStoreQuery}
    LEFT JOIN std_location_tb s_l ON s_l.location_id = i_s.location_id
    LEFT JOIN std_reject_tb s_r ON s_r.reject_id = i_s.reject_id
    WHERE CAST(i_s.reg_date AS DATE) <= '${params.reg_date}'
    ${searchQuery}
    GROUP BY s_f.uuid, i_s.factory_id, i_s.prod_id, i_s.reject_id, i_s.lot_no, i_s.store_id, i_s.location_id
    ORDER BY i_s.prod_id, i_s.lot_no;
  `;
  //#endregion

  //#region 📌 재고 분류(Group by)
  let groupedStockQuery: string = '';

  switch (params.grouped_type) {
    case 'all':
      break;
    case 'factory':
      groupedStockQuery = `GROUP BY i_s.factory_uuid, i_s.factory_id, i_s.prod_id, i_s.reject_id`;
      break;
    case 'store':
      groupedStockQuery = `GROUP BY i_s.factory_uuid, i_s.factory_id, i_s.prod_id, i_s.store_id, i_s.reject_id`;
      break;
    case 'lotNo':
      groupedStockQuery = `GROUP BY i_s.factory_uuid, i_s.factory_id, i_s.prod_id, i_s.store_id, i_s.lot_no, i_s.reject_id`;
      break;
    case 'location':
      groupedStockQuery = `GROUP BY i_s.factory_uuid, i_s.factory_id, i_s.prod_id, i_s.store_id, i_s.location_id, i_s.reject_id`;
      break;
    default:
      break;
  }

  // 📌 분류 유형(groupedType) 에 따라서 분류(Group by)하여 조회
  // 📌 분류 유형(groupedType) : [Factory(공장, 품목), Store(공장, 품목, 창고), LotNo(공장, 품목, LotNo, 창고), Location(공장, 품목, 창고, 위치)]
  const createGroupedStockTempTableQuery: string = `
    CREATE TEMP TABLE temp_store(
      factory_uuid uuid,
      factory_id int,
      prod_id int,
      reject_id int,
      lot_no varchar(25),
      qty numeric(19,6),
      store_id int,
      location_id int
    );
    CREATE INDEX ON temp_store(prod_id, lot_no);

    INSERT INTO temp_store(factory_uuid, factory_id, prod_id, reject_id, lot_no, qty, store_id, location_id)
    SELECT i_s.factory_uuid, i_s.factory_id, i_s.prod_id, i_s.reject_id, i_s.lot_no, i_s.qty, i_s.store_id, i_s.location_id
    FROM temp_base_store i_s
    ${groupedStockQuery};
  `;
  //#endregion

  //#region 📌 단가 유형 분류
  // 📌 단가 유형(priceType) 에 따라 조회
  // 📌 단가 유형(priceType) : [Purchase(구매품목), Sales(판매품목), Undefined(전체조회)]
  searchQuery = '';
  if (params.partner_uuid) { searchQuery += ` AND s_pa.uuid = '${params.partner_uuid}'`; }
  let createMainStockReadingTempTable: string = `
    CREATE TEMP TABLE temp_store_main(
      factory_uuid uuid,
      factory_id int,
      prod_id int,
      reject_id int,
      lot_no varchar(25),
      qty numeric(19,6),
      store_id int,
      location_id int,
      partner_id int,
      price numeric(19,6),
      money_unit_id int,
      price_type_id int,
      exchange numeric(19,6)
    );
    CREATE INDEX ON temp_store_main(prod_id, lot_no);
  `;
  switch (params.price_type) {
    case 'purchase':
      createMainStockReadingTempTable += `
        INSERT INTO temp_store_main
        SELECT 
          t_s.factory_uuid,
          t_s.factory_id,
          s_vp.prod_id,
          t_s.reject_id,
          t_s.lot_no,
          t_s.qty,
          t_s.store_id,
          t_s.location_id,
          s_vp.partner_id,
          s_vp.price,
          s_vp.money_unit_id,
          s_vp.price_type_id,
          1
        FROM std_vendor_price_tb s_vp
        JOIN std_prod_tb s_p ON s_p.prod_id = s_vp.prod_id AND s_p.mat_order_fg = TRUE 
        JOIN std_partner_tb s_pa ON s_pa.partner_id = s_vp.partner_id
        JOIN temp_store t_s ON t_s.prod_id = s_vp.prod_id 
        WHERE '${params.reg_date}' BETWEEN s_vp.start_date AND s_vp.end_date 
        ${searchQuery};
      `;
      break;
    case 'sales':
      createMainStockReadingTempTable += `
        INSERT INTO temp_store_main
        SELECT 
          t_s.factory_uuid,
          t_s.factory_id,
          s_cp.prod_id,
          t_s.reject_id,
          t_s.lot_no,
          t_s.qty,
          t_s.store_id,
          t_s.location_id,
          s_cp.partner_id,
          s_cp.price,
          s_cp.money_unit_id,
          s_cp.price_type_id,
          1
        FROM std_customer_price_tb s_cp
        JOIN std_prod_tb s_p ON s_p.prod_id = s_cp.prod_id AND s_p.sal_order_fg = TRUE 
        JOIN std_partner_tb s_pa ON s_pa.partner_id = s_cp.partner_id
        JOIN temp_store t_s ON t_s.prod_id = s_cp.prod_id 
        WHERE '${params.reg_date}' BETWEEN s_cp.start_date AND s_cp.end_date 
        ${searchQuery};
      `;
      break;
    default:
      createMainStockReadingTempTable += `
        INSERT INTO temp_store_main(factory_uuid, factory_id, prod_id, reject_id, lot_no, qty, store_id, location_id)
        SELECT * FROM temp_store t_s;
      `;
      break;
  }
  //#endregion

  //#region 📌 추가 테이블 Join 및 조회
  searchQuery = '';
  if (params.exclude_zero_fg) { searchQuery += ` AND COALESCE(t_s.qty,0) <> 0`; }
  if (params.exclude_minus_fg) { searchQuery += ` AND COALESCE(t_s.qty,0) > 0`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  // 📌 Filtering 되어있는 재고 정보에 추가 테이블 Join 하여 조회
  const readStockQuery = `
    SELECT 
      COALESCE(t_s.factory_uuid, '${params.factory_uuid}') as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
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
      s_r.uuid as reject_uuid,
      s_r.reject_cd,
      s_r.reject_nm,
      t_s.lot_no,
      t_s.qty,
      s_s.uuid as store_uuid,
      s_s.store_cd,
      s_s.store_nm,
      s_l.uuid as location_uuid,
      s_l.location_cd,
      s_l.location_nm,
      s_ptn.uuid as partner_uuid,
      s_ptn.partner_cd,
      s_ptn.partner_nm,
      t_s.price,
      s_mu.uuid as money_unit_uuid,
      s_mu.money_unit_cd,
      s_mu.money_unit_nm,
      s_pty.uuid as price_type_uuid,
      s_pty.price_type_cd,
      s_pty.price_type_nm,
      t_s.exchange
    FROM temp_store_main t_s
    JOIN std_factory_tb s_f ON s_f.uuid = COALESCE(t_s.factory_uuid, '${params.factory_uuid}')
    JOIN std_prod_tb s_p ON s_p.prod_id = t_s.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_store_tb s_s ON s_s.store_id = t_s.store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = t_s.location_id
    LEFT JOIN std_partner_tb s_ptn ON s_ptn.partner_id = t_s.partner_id
    LEFT JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = t_s.money_unit_id
    LEFT JOIN std_price_type_tb s_pty ON s_pty.price_type_id = t_s.price_type_id
    LEFT JOIN std_reject_tb s_r ON s_r.reject_id = t_s.reject_id
    ${searchQuery}
    ORDER BY t_s.prod_id, t_s.lot_no;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
    DROP TABLE temp_base_store;
    DROP TABLE temp_store;
    DROP TABLE temp_store_main;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 공장(Factory), 창고(Store), 위치(Location), 품목(Prod), 부적합(Reject), LotNo를 기준으로 재고를 가지고 있는 기준 임시 테이블 생성
    -- 재고 유형(stockType) [가용재고(Available), Reject(부적합재고), Return(반출대기재고), Outgo(출하대기재고)] 에 따라 Filtering
    ${createBaseTempTableQuery}

    -- 분류 유형(groupedType) 에 따라서 분류(Group by)하여 조회
    -- 분류 유형(groupedType) : 
    -- Factory(공장, 품목, 부적합) 
    -- Store(공장, 품목, 부적합, 창고)
    -- LotNo(공장, 품목, 부적합, LotNo, 창고)
    -- Location(공장, 품목, 부적합, 창고, 위치)]
    ${createGroupedStockTempTableQuery}

    -- 단가 유형(priceType) 에 따라 조회
    -- 단가 유형(priceType) : [Purchase(구매품목), Sales(판매품목), Undefined(전체조회)]
    ${createMainStockReadingTempTable}

    -- Filtering 되어있는 재고 정보에 추가 테이블 Join 하여 조회
    ${readStockQuery}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readStocks }