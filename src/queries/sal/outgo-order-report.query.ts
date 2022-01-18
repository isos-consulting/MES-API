const readOutgoOrderReport = (
  params: {
    sort_type?: 'partner' | 'prod' | 'date',
    start_date?: string,
    end_date?: string,
    factory_uuid?: string,
  }
) => {
  let searchQuery: string = '';
  
  const createOutgoOrderTempTable = `
    CREATE TEMP TABLE temp_outgo_order(
      outgo_order_detail_id int,
      factory_id int, 
      reg_date timestamp, 
      partner_id int, 
      prod_id int, 
      order_qty numeric,
      outgo_qty numeric,
      qty numeric, 
      balance numeric,
      complete_state TEXT,
      remark varchar(250),
      created_at timestamptz, created_uid int, created_nm varchar(20), 
      updated_at timestamptz, updated_uid int, updated_nm varchar(20)
    );
  `;

  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.start_date && params.end_date) { searchQuery += ` AND DATE(s_oo.reg_date) BETWEEN '${params.start_date}' AND '${params.end_date}'`; }

  if (searchQuery.length > 0) {
    searchQuery = searchQuery.substring(4, searchQuery.length);
    searchQuery = 'WHERE' + searchQuery;
  }

  const insertDataToTempTable = `
    INSERT INTO temp_outgo_order
    SELECT 
      s_ood.outgo_order_detail_id,
      s_ood.factory_id,
      s_oo.reg_date,
      s_oo.partner_id,
      s_ood.prod_id,
      s_od.qty,
      s_ogd.qty,
      s_ood.qty,
      CASE WHEN (s_ood.qty - COALESCE(s_ogd.qty,0)) < 0 THEN 0 ELSE s_ood.qty - COALESCE(s_ogd.qty,0) END,
      CASE WHEN s_ood.complete_fg = FALSE AND ((s_ood.qty - COALESCE(s_ogd.qty,0)) > 0) THEN '미완료' ELSE '완료' END,
      s_ood.remark,
      s_ood.created_at, s_ood.created_uid, a_uc.user_nm,
      s_ood.updated_at, s_ood.updated_uid, a_uu.user_nm
    FROM sal_outgo_order_detail_tb s_ood
    JOIN std_factory_tb s_f ON s_f.factory_id = s_ood.factory_id
    JOIN sal_outgo_order_tb s_oo ON s_oo.outgo_order_id = s_ood.outgo_order_id
    LEFT JOIN (	
      SELECT s_od.order_detail_id, sum(COALESCE(s_od.qty,0)) AS qty
      FROM sal_order_detail_tb s_od
      WHERE s_od.order_detail_id IS NOT NULL
      GROUP BY s_od.order_detail_id 
    ) s_od ON s_od.order_detail_id = s_ood.order_detail_id
    LEFT JOIN (	
      SELECT s_ogd.outgo_order_detail_id, sum(COALESCE(s_ogd.qty,0)) AS qty
      FROM sal_outgo_detail_tb s_ogd
      WHERE s_ogd.outgo_order_detail_id IS NOT NULL
      GROUP BY s_ogd.outgo_order_detail_id 
    ) s_ogd ON s_ogd.outgo_order_detail_id = s_ood.outgo_order_detail_id
    LEFT JOIN aut_user_tb a_uc ON a_uc.uid = s_ood.created_uid
    LEFT JOIN aut_user_tb a_uu ON a_uu.uid = s_ood.updated_uid
    ${searchQuery};
  `;

  let reportOrderBy: string;
  switch (params.sort_type) {
    case 'partner': reportOrderBy = `ORDER BY t_o.partner_id`; break;
    case 'prod': reportOrderBy = `ORDER BY t_o.prod_id`; break;
    case 'date': reportOrderBy = `ORDER BY t_o.reg_date`; break;
    default: reportOrderBy = ''; break;
  }

  const readReport = `
    SELECT 
      s_ood.uuid as outgo_order_detail_uuid,
      s_f.uuid as factory_uuid,
      s_f.factory_cd,
      s_f.factory_nm,
      t_o.reg_date,
      s_pa.uuid AS partner_uuid,
      s_pa.partner_cd,
      s_pa.partner_nm,
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
      COALESCE(t_o.order_qty, 0) as order_qty,
      COALESCE(t_o.outgo_qty, 0) as outgo_qty,
      t_o.qty,
      t_o.balance,
      t_o.complete_state,
      t_o.remark,
      t_o.created_at,							
      t_o.created_uid,						
      t_o.created_nm,				
      t_o.updated_at,							
      t_o.updated_uid,						
      t_o.updated_nm				
    FROM temp_outgo_order t_o
    LEFT JOIN sal_outgo_order_detail_tb s_ood ON s_ood.outgo_order_detail_id = t_o.outgo_order_detail_id
    LEFT JOIN std_factory_tb s_f ON s_f.factory_id = t_o.factory_id
    LEFT JOIN std_partner_tb s_pa ON s_pa.partner_id = t_o.partner_id
    LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_o.prod_id
    LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
    LEFT JOIN std_prod_type_tb s_pt ON s_pt.prod_type_id = s_p.prod_type_id
    LEFT JOIN std_model_tb s_m ON s_m.model_id = s_p.model_id
    LEFT JOIN std_unit_tb s_u ON s_u.unit_id = s_p.unit_id
    ${reportOrderBy};
  `;

  const dropTempTable = `
    DROP TABLE temp_outgo_order;
  `;

  const query = `
    -- 📌 제품출하지시현황을 조회하기 위하여 임시테이블 생성
    ${createOutgoOrderTempTable}

    -- 📌 임시테이블에 제품출하지시현황 기초데이터 입력
    ${insertDataToTempTable}

    -- 📌 제품출하지시현황 조회
    ${readReport}

    -- 📌 임시테이블 삭제
    ${dropTempTable}
  `;

  return query;
}

export { readOutgoOrderReport }