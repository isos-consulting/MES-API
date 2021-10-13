const readStoreTypeInventory = (
  params: {
    start_date: string,
    end_date: string,
    stock_type: 'all' | 'available' | 'reject' | 'return' | 'outgo' | 'finalInsp',
    grouped_type: 'all' | 'factory' | 'store' | 'lotNo' | 'location',
    reject_fg?: boolean,
    factory_uuid?: string,
    store_uuid?: string,
  }) => {
  let searchQuery: string = '';

  //#region 📌 전체 재고 조회
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.store_uuid) { searchQuery += ` AND s_s.uuid = '${params.store_uuid}'`; }

  // 📌 공장(Factory), 창고(Store), 위치(Location), 품목(Prod), LotNo를 기준으로 재고를 가지고 있는 기준 임시 테이블 생성
  // 📌 재고 유형(stockType) 에 따라 Filtering 
  // 📌 [가용재고(Available), Reject(부적합재고), Return(반출대기재고), Outgo(출하대기재고)] 에 따라 Filtering
  const createTempTable = `
    CREATE TEMP TABLE temp_store(
      factory_id int,
      prod_id int,
      reject_id int,
      lot_no varchar(25),
      store_id int,
      location_id int,
      tran_cd varchar(20),
      inout_fg boolean,
      qty numeric(19,6)
    );
    CREATE INDEX ON temp_store(prod_id, lot_no);

    INSERT INTO temp_store
    SELECT
      i_s.factory_id,
      i_s.prod_id,
      i_s.reject_id,
      i_s.lot_no,
      i_s.store_id,
      i_s.location_id,
      i_s.tran_cd,
      i_s.inout_fg,
      sum(COALESCE(i_s.qty,0))
    FROM inv_store_tb i_s
    JOIN std_factory_tb s_f ON s_f.factory_id = i_s.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = i_s.prod_id
    JOIN std_store_tb s_s ON s_s.store_id = i_s.store_id
    WHERE CAST(i_s.reg_date AS DATE) BETWEEN '${params.start_date}' AND '${params.end_date}'
    ${searchQuery}
    GROUP BY i_s.factory_id, i_s.store_id, i_s.location_id, i_s.prod_id, i_s.reject_id, i_s.lot_no, i_s.tran_cd, i_s.inout_fg;
  `;
  //#endregion

  //#region 📌 재고 분류(Group by)
  let insertToGroupedTempTable: string = '';

  switch (params.grouped_type) {
    case 'all':
      insertToGroupedTempTable = `
        INSERT INTO temp_store_group(factory_id, prod_id, reject_id, lot_no, store_id, location_id, tran_cd, inout_fg, qty)
        SELECT 
          t_s.factory_id, t_s.prod_id, ${params.reject_fg ? 't_s.reject_id' : 'NULL'}, 
          t_s.lot_no, t_s.store_id, t_s.location_id, t_s.tran_cd, t_s.inout_fg, SUM(COALESCE(t_s.qty, 0))
        FROM temp_store t_s
        GROUP BY t_s.factory_id, t_s.prod_id ${params.reject_fg ? ', t_s.reject_id' : ''}, t_s.lot_no, t_s.store_id, t_s.location_id, t_s.tran_cd, t_s.inout_fg;
      `;
      break;
    case 'factory': 
      insertToGroupedTempTable = `
        INSERT INTO temp_store_group(factory_id, prod_id, reject_id, lot_no, store_id, location_id, tran_cd, inout_fg, qty)
        SELECT 
          t_s.factory_id, t_s.prod_id, ${params.reject_fg ? 't_s.reject_id' : 'NULL'}, 
          NULL, NULL, NULL, t_s.tran_cd, t_s.inout_fg, SUM(COALESCE(t_s.qty, 0))
        FROM temp_store t_s
        GROUP BY t_s.factory_id, t_s.prod_id ${params.reject_fg ? ', t_s.reject_id' : ''}, t_s.tran_cd, t_s.inout_fg;
      `;
      break;
    case 'store': 
      insertToGroupedTempTable = `
        INSERT INTO temp_store_group(factory_id, prod_id, reject_id, lot_no, store_id, location_id, tran_cd, inout_fg, qty)
        SELECT 
          t_s.factory_id, t_s.prod_id, ${params.reject_fg ? 't_s.reject_id' : 'NULL'}, 
          NULL, t_s.store_id, NULL, t_s.tran_cd, t_s.inout_fg, SUM(COALESCE(t_s.qty, 0))
        FROM temp_store t_s
        GROUP BY t_s.factory_id, t_s.prod_id ${params.reject_fg ? ', t_s.reject_id' : ''}, t_s.store_id, t_s.tran_cd, t_s.inout_fg;
      `;
      break;
    case 'lotNo': 
      insertToGroupedTempTable = `
        INSERT INTO temp_store_group(factory_id, prod_id, reject_id, lot_no, store_id, location_id, tran_cd, inout_fg, qty)
        SELECT 
          t_s.factory_id, t_s.prod_id, ${params.reject_fg ? 't_s.reject_id' : 'NULL'}, 
          t_s.lot_no, t_s.store_id, NULL, t_s.tran_cd, t_s.inout_fg, SUM(COALESCE(t_s.qty, 0))
        FROM temp_store t_s
        GROUP BY t_s.factory_id, t_s.prod_id ${params.reject_fg ? ', t_s.reject_id' : ''}, t_s.lot_no, t_s.store_id, t_s.tran_cd, t_s.inout_fg;
      `;
      break;
    case 'location': 
      insertToGroupedTempTable = `
        INSERT INTO temp_store_group(factory_id, prod_id, reject_id, lot_no, store_id, location_id, tran_cd, inout_fg, qty)
        SELECT 
          t_s.factory_id, t_s.prod_id, ${params.reject_fg ? 't_s.reject_id' : 'NULL'}, 
          NULL, t_s.store_id, t_s.location_id, t_s.tran_cd, t_s.inout_fg, SUM(COALESCE(t_s.qty, 0))
        FROM temp_store t_s
        GROUP BY t_s.factory_id, t_s.prod_id ${params.reject_fg ? ', t_s.reject_id' : ''}, t_s.store_id, t_s.location_id, t_s.tran_cd, t_s.inout_fg;
      `;
      break;
    default: break;
  }

  // 📌 분류 유형(groupedType) 에 따라서 분류(Group by)하여 조회
  // 📌 분류 유형(groupedType) : [Factory(공장, 품목), Store(공장, 품목, 창고), LotNo(공장, 품목, LotNo, 창고), Location(공장, 품목, 창고, 위치)]
  const createGroupedTempTable: string = `
    CREATE TEMP TABLE temp_store_group(
      factory_id int,
      prod_id int,
      reject_id int,
      lot_no varchar(25),
      store_id int,
      location_id int,
      tran_cd varchar(20),
      inout_fg boolean,
      qty numeric(19,6)
    );
    CREATE INDEX ON temp_store(factory_id);
    CREATE INDEX ON temp_store(prod_id);
    CREATE INDEX ON temp_store(reject_id);
    CREATE INDEX ON temp_store(store_id);
    CREATE INDEX ON temp_store(location_id);
    CREATE INDEX ON temp_store(lot_no);

    ${insertToGroupedTempTable}
  `;
  //#endregion

  //#region 📌 추가 테이블 Join 및 조회
  // 📌 Filtering 되어있는 재고 정보에 추가 테이블 Join 하여 조회
  const readTypeHistory = `
    SELECT 
      s_f.uuid as factory_uuid,
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
      s_s.uuid as store_uuid,
      s_s.store_cd,
      s_s.store_nm,
      s_s.uuid as location_uuid,
      s_l.location_cd,
      s_l.location_nm,
      t_s.inout_fg,
      t_s.tran_cd,
      t_s.qty
    FROM temp_store_group t_s
    JOIN std_factory_tb s_f ON s_f.factory_id = t_s.factory_id
    JOIN std_prod_tb s_p ON s_p.prod_id = t_s.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    LEFT JOIN std_store_tb s_s ON s_s.store_id = t_s.store_id
    LEFT JOIN std_location_tb s_l ON s_l.location_id = t_s.location_id
    LEFT JOIN std_reject_tb s_r ON s_r.reject_id = t_s.reject_id
    ORDER BY t_s.factory_id, t_s.store_id, t_s.prod_id, t_s.tran_cd, t_s.inout_fg;
  `;
  //#endregion

  //#region 📌 임시테이블 Drop
  // 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
  const dropTempTableQuery = `
    DROP TABLE temp_store;
    DROP TABLE temp_store_group;
  `;
  //#endregion

  //#region 📒 Main Query
  const query = `
    -- 공장(Factory), 창고(Store), 위치(Location), 품목(Prod), 부적합(Reject), LotNo를 기준으로 재고를 가지고 있는 기준 임시 테이블 생성
    ${createTempTable}

    -- 분류 유형(groupedType) 에 따라서 분류(Group by)하여 조회
    -- 분류 유형(groupedType) : 
    -- Factory(공장, 품목, 부적합) 
    -- Store(공장, 품목, 부적합, 창고)
    -- LotNo(공장, 품목, 부적합, LotNo, 창고)
    -- Location(공장, 품목, 부적합, 창고, 위치)]
    ${createGroupedTempTable}

    -- Filtering 되어있는 재고 정보에 추가 테이블 Join 하여 조회
    ${readTypeHistory}

    -- 생성된 임시테이블(Temp Table) 삭제(Drop)
    ${dropTempTableQuery}
  `;
  //#endregion

  return query;
}

export { readStoreTypeInventory }