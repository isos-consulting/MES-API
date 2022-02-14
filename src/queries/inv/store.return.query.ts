const readReturnStocks = (
  params: {
    reg_date: string,
    exclude_zero_fg?: boolean,
    exclude_minus_fg?: boolean,
    partner_uuid?: string,
    factory_uuid?: string,
    store_uuid?: string,
    location_uuid?: string,
  }) => {
  //#region 📌 반출창고 재고 조회
  // 📌 협력사 단가의 단위와 품목의 재고단위를 포함하는 반출창고 재고 조회
  const createStoreTempTable = `
    CREATE TEMP TABLE temp_store(
      factory_uuid uuid,
      factory_id int,
      store_id int,
      location_id int,
      prod_id int,
      lot_no varchar(25),
      price numeric(19,6),
      exchange numeric(19,6),
      money_unit_id int,
      price_type_id int,
      qty numeric(19,6),
      return_unit_id int,
      unit_id int
    );
    CREATE INDEX ON temp_store(prod_id, lot_no);
    
    INSERT INTO temp_store
    SELECT 
      s_f.uuid,
      i_s.factory_id,
      i_s.store_id,
      i_s.location_id,
      i_s.prod_id,
      i_s.lot_no,
      s_vp.price,
      1.0,
      s_vp.money_unit_id,
      s_vp.price_type_id,
      sum(CASE WHEN i_s.inout_fg = FALSE THEN COALESCE(i_s.qty,0) * -1 ELSE COALESCE(i_s.qty,0) END) AS qty,
      s_vp.unit_id AS return_unit_id,
      s_p.unit_id AS unit_id
    FROM inv_store_tb i_s 
    JOIN std_factory_tb s_f ON s_f.factory_id = i_s.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = i_s.prod_id 
    JOIN std_store_tb s_s ON s_s.store_id = i_s.store_id AND s_s.return_store_fg = TRUE
    LEFT JOIN std_location_tb s_l ON s_l.location_id = i_s.location_id
    JOIN std_vendor_price_tb s_vp ON s_vp.prod_id = i_s.prod_id 
                                  AND '${params.reg_date}' BETWEEN CAST(s_vp.start_date AS DATE) AND CAST(s_vp.end_date AS DATE)
    JOIN std_partner_tb s_pa ON s_pa.partner_id = s_vp.partner_id AND s_pa.uuid = '${params.partner_uuid}'
    WHERE CAST(i_s.reg_date AS DATE) <= '${params.reg_date}'
    ${params.factory_uuid ? ` AND s_f.uuid = '${params.factory_uuid}'` : ''}
    ${params.store_uuid ? ` AND s_s.uuid = '${params.store_uuid}'` : ''}
    ${params.location_uuid ? ` AND s_l.uuid = '${params.location_uuid}'` : ''}
    GROUP BY s_f.uuid, i_s.factory_id, i_s.store_id, i_s.location_id, i_s.prod_id,i_s.lot_no, s_vp.price, s_vp.money_unit_id, s_vp.price_type_id, s_p.unit_id, s_vp.unit_id;
  `;
  //#endregion

  //#region 📌 단위 변환 임시테이블 생성
  // 📌 품목 재고의 단위와 협력사 단가의 단위를 변환시켜 주기 위하여 임시테이블 생성
  const createUnitConvertTempTable = `
    CREATE TEMP TABLE temp_unit_convert(
      prod_id int,
      from_unit_id int,
      to_unit_id int,
      convert_value numeric(19,6)
    );
    CREATE INDEX ON temp_unit_convert(prod_id);
    
    INSERT INTO temp_unit_convert(prod_id, from_unit_id, to_unit_id, convert_value)
    SELECT s_uc.prod_id, s_uc.from_unit_id, s_uc.to_unit_id, s_uc.convert_value 
    FROM std_unit_convert_tb s_uc;
  `;
  //#endregion

  //#region 📌 추가 테이블 Join 및 조회
  let searchQuery: string = '';
  if (params.exclude_zero_fg) { searchQuery += ` AND COALESCE(t_s.qty,0) <> 0`; }
  if (params.exclude_minus_fg) { searchQuery += ` AND COALESCE(t_s.qty,0) > 0`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  // 📌 Filtering 되어있는 재고 정보에 추가 테이블 Join 하여 조회
  const readStockQuery = `
    SELECT 
      t_s.factory_uuid,
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
      t_s.lot_no,
      t_s.qty,
      s_s.uuid as store_uuid,
      s_s.store_cd,
      s_s.store_nm,
      s_l.uuid as location_uuid,
      s_l.location_cd,
      s_l.location_nm,
      t_s.price,
      t_s.exchange,
      s_mu.uuid as money_unit_uuid,
      s_mu.money_unit_cd,
      s_mu.money_unit_nm,
      s_pty.uuid as price_type_uuid,
      s_pty.price_type_cd,
      s_pty.price_type_nm,
      s_u.uuid as unit_uuid,
      s_u.unit_cd,
      s_u.unit_nm,
      s_u2.uuid as return_unit_uuid,
      s_u2.unit_cd as return_unit_cd,
      s_u2.unit_nm as return_unit_nm,
      CASE WHEN t_s.unit_id = t_s.return_unit_id THEN 1 ELSE coalesce(t_uc.convert_value, t_uc2.convert_value) END as convert_value,
      t_s.qty * CASE WHEN t_s.unit_id = t_s.return_unit_id THEN 1 ELSE coalesce(t_uc.convert_value, t_uc2.convert_value) END as return_qty
    FROM temp_store t_s
    JOIN std_factory_tb s_f ON s_f.factory_id = t_s.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = t_s.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_store_tb s_s ON s_s.store_id = t_s.store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = t_s.location_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = t_s.unit_id
    LEFT JOIN std_unit_tb s_u2 ON s_u2.unit_id = t_s.return_unit_id
    LEFT JOIN std_money_unit_tb s_mu ON s_mu.money_unit_id = t_s.money_unit_id
    LEFT JOIN std_price_type_tb s_pty ON s_pty.price_type_id = t_s.price_type_id
    LEFT JOIN temp_unit_convert t_uc ON t_uc.prod_id = t_s.prod_id AND t_uc.from_unit_id = t_s.unit_id AND t_uc.to_unit_id = t_s.return_unit_id
    LEFT JOIN temp_unit_convert t_uc2 ON t_uc2.from_unit_id = t_s.unit_id AND t_uc2.to_unit_id = t_s.return_unit_id
    ${searchQuery}
    ORDER BY t_s.prod_id, t_s.lot_no;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
    DROP TABLE temp_unit_convert;
    DROP TABLE temp_store;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 협력사 단가의 단위와 품목의 재고단위를 포함하는 반출창고 재고 조회
    ${createStoreTempTable}

    -- 품목 재고의 단위와 협력사 단가의 단위를 변환시켜 주기 위하여 임시테이블 생성
    ${createUnitConvertTempTable}

    -- Filtering 되어있는 재고 정보에 추가 테이블 Join 하여 조회
    ${readStockQuery}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readReturnStocks }