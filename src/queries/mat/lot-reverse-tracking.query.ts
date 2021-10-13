const readLotReverseReport = (
	params: {
	factory_uuid: string,
	prod_uuid: string, 
	lot_no: string,
}) => {
	const searchId = `
		select prod_id  INTO prodId from std_prod_tb where uuid= '${params.prod_uuid}';
		select factory_id  INTO factoryId from std_factory_tb where uuid= '${params.factory_uuid}';
	`;

	//#region 📌 입하기준 lot 추적 품번, lot 기준 임시 테이블 생성
	const createBaseTempTableQuery = `
		CREATE TEMP TABLE temp_lot(
			proc_id int,
			equip_id int,
			reg_date timestamptz,
			prod_id int,
			lot_no varchar(50),
			work_prod_id int,
			work_lot_no varchar(50),
			partner_id int,
			out_reg_date timestamptz,
			out_qty NUMERIC,
			sortby varchar(100),
			lv NUMERIC
		);
		CREATE INDEX ON temp_lot(prod_id, lot_no);

		INSERT INTO temp_lot
		WITH RECURSIVE lot_tracking AS (
		SELECT 	p_wi.prod_id, p_wi.lot_no, 
						p_w.proc_id AS work_proc_id,  p_w.equip_id AS work_equip_id, p_w.reg_date AS work_date, 
						p_w.prod_id AS work_prod_id, p_w.lot_no AS work_lot_no, p_wi2.work_input_id,
						p_wi.prod_id::text AS sortby,0 AS lv
		FROM prd_work_input_tb p_wi 
		JOIN prd_work_tb p_w ON p_w.work_id = p_wi.work_id 
		LEFT JOIN prd_work_input_tb p_wi2	ON p_wi2.prod_id = p_w.prod_id 
																			AND p_wi2.lot_no = p_w.lot_no 
		LEFT JOIN std_factory_tb s_f ON s_f.factory_id = p_wi.factory_id
		WHERE s_f.factory_id = factoryId
		AND p_wi.prod_id = prodId AND p_wi.lot_no = '${params.lot_no}'
		GROUP BY p_w.proc_id, p_w.equip_id, p_w.reg_date, p_wi.prod_id, p_wi.lot_no, p_w.prod_id, p_w.lot_no, p_wi2.work_input_id,lv

		UNION

		SELECT 	p_wi.prod_id, p_wi.lot_no, 
						p_w.proc_id AS work_proc_id,  p_w.equip_id AS work_equip_id, p_w.reg_date AS work_date,
						p_w.prod_id AS work_prod_id, p_w.lot_no AS work_lot_no, p_wi2.work_input_id,
						concat(l_t.sortby, ' > ', p_w.prod_id::text) AS concat, lv+1
		FROM prd_work_input_tb p_wi 
		JOIN lot_tracking l_t ON l_t.work_input_id = p_wi.work_input_id 
		JOIN prd_work_tb p_w ON p_w.work_id = p_wi.work_id 
		LEFT JOIN prd_work_input_tb p_wi2	ON p_wi2.prod_id = p_w.prod_id 
																			AND p_wi2.lot_no = p_w.lot_no 
		GROUP BY p_w.proc_id, p_w.equip_id, p_w.reg_date, p_wi.prod_id, p_wi.lot_no, p_w.prod_id, p_w.lot_no, p_wi2.work_input_id, l_t.sortby,lv
		)
		SELECT 	l_t.work_proc_id,l_t.work_equip_id, l_t.work_date,
						l_t.prod_id, l_t.lot_no,l_t.work_prod_id, l_t.work_lot_no,
						s_o.partner_id, s_o.reg_date, sum(s_od.qty),l_t.sortby,l_t.lv
		FROM lot_tracking l_t
		LEFT JOIN sal_outgo_detail_tb s_od 	ON s_od.prod_id = l_t.work_prod_id
																				AND s_od.lot_no = l_t.work_lot_no
																				AND l_t.work_input_id IS NULL
		LEFT JOIN sal_outgo_tb s_o ON s_o.outgo_id = s_od.outgo_id 
		GROUP BY 	l_t.prod_id, l_t.lot_no, l_t.work_proc_id, l_t.work_equip_id, l_t.work_date,
		l_t.work_prod_id, l_t.work_lot_no, s_o.partner_id, s_o.reg_date, s_od.qty, l_t.sortby,l_t.lv
		ORDER BY l_t.sortby, l_t.work_date;
	`;
	//#endregion

	//#region 📌 추가 테이블 Join 및 조회
	// Filtering 되어있는 정보에 추가 테이블 Join 하여 조회
	const readLotTrackingQuery = `
		SELECT
			s_proc.proc_cd,
			s_proc.proc_nm,
			s_equip.equip_cd,
			s_equip.equip_nm,
			s_p.prod_no as input_prod_no,
			s_p.prod_nm as input_pord_nm,
			s_it.item_type_cd as input_item_type_cd,
			s_it.item_type_nm as input_item_type_nm,
			t_l.lot_no as input_lot_no,
			t_l.reg_date as work_date,
			s_p2.prod_no as work_prod_no ,
			s_p2.prod_nm as work_prod_nm,
			s_it2.item_type_cd as work_item_type_cd,
			s_it2.item_type_nm as work_item_type_nm,
			t_l.work_lot_no as work_lot_no,
			s_partner.partner_cd ,
			s_partner.partner_nm ,
			t_l.out_reg_date as outgo_date,
			t_l.out_qty as outgo_qty,
			t_l.sortby,
			t_l.lv as level
		FROM temp_lot t_l
		LEFT JOIN std_proc_tb s_proc ON s_proc.proc_id  = t_l.proc_id
		LEFT JOIN std_equip_tb s_equip ON s_equip.equip_id  = t_l.equip_id
		LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_l.prod_id
		LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
		LEFT JOIN std_prod_tb s_p2 ON s_p2.prod_id = t_l.work_prod_id
		LEFT JOIN std_item_type_tb s_it2 ON s_it2.item_type_id = s_p2.item_type_id
		LEFT JOIN std_partner_tb s_partner ON s_partner.partner_id = t_l.partner_id
		ORDER BY t_l.sortby, t_l.LOT_NO, t_l.reg_date;
	`;

	//#endregion
	//#region 📌 임시테이블 Drop
	// 📌 생성된 임시테이블(Temp Table) 삭제(Drop)
	const dropTempTableQuery = `
		DROP TABLE temp_lot;
	`;
	//#endregion


	//#region 📒 Main Query
	const query = `
	DO $$
	DECLARE
		prodId INT;
		factoryId INT;
	BEGIN
		${searchId}
		--lot, 품번으로 입하기준 lot 추적
		${createBaseTempTableQuery} 
	END $$;
		-- Filtering 되어있는 정보에 추가 테이블 Join 하여 조회
		${readLotTrackingQuery}  
		-- 생성된 임시테이블(Temp Table) 삭제(Drop)
		${dropTempTableQuery}

	`;
	//#endregion

	return query;
}

export { readLotReverseReport }