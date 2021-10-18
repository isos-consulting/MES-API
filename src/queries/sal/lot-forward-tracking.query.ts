const readLotForwardReport = (
	params: {
	factory_uuid: string,
	prod_uuid: string, 
	lot_no: string,
}) => {
	const searchId = `
		select prod_id  INTO prodId from std_prod_tb where uuid= '${params.prod_uuid}';
		select factory_id  INTO factoryId from std_factory_tb where uuid= '${params.factory_uuid}';
	`;

	//#region 📌 출하기준 lot 추적 품번, lot 기준 임시 테이블 생성
	const createBaseTempTableQuery = `
		CREATE TEMP TABLE temp_lot(
			proc_id int,
			equip_id int,
			reg_date timestamptz,
			prod_id int,
			lot_no varchar(50),
			input_prod_id int,
			input_lot_no varchar(50),
			partner_id int,
			in_reg_date timestamptz,
			in_qty NUMERIC,
			sortby varchar(100),
			lv NUMERIC
		);
		CREATE INDEX ON temp_lot(prod_id, lot_no);

		INSERT INTO temp_lot
		WITH RECURSIVE lot_tracking AS (
		SELECT 	p_w.proc_id, p_w.equip_id, p_w.reg_date, p_w.prod_id, p_w.lot_no,
				p_wi.prod_id AS input_prod_id, p_wi.lot_no AS input_lot_no, i_pw.work_id AS input_work_id,
				p_w.prod_id::text AS sortby, 0 AS lv
		FROM prd_work_tb p_w 
		JOIN prd_work_input_tb p_wi ON p_wi.work_id = p_w.work_id
		LEFT JOIN prd_work_tb i_pw 	ON i_pw.prod_id = p_wi.prod_id 
									AND i_pw.lot_no = p_wi.lot_no
		LEFT JOIN std_factory_tb s_f ON s_f.factory_id = p_w.factory_id
		WHERE p_w.prod_id = prodId AND p_w.lot_no = '${params.lot_no}'
		AND s_f.factory_id = factoryId
		
		UNION
		
		SELECT 	p_w.proc_id, p_w.equip_id, p_w.reg_date, p_w.prod_id, p_w.lot_no,
				p_wi.prod_id AS input_prod_id, p_wi.lot_no AS input_lot_no, i_pw.work_id AS input_work_id,
				concat(l_t.sortby, ' > ', p_w.prod_id::text) AS concat, lv+1
		FROM prd_work_tb p_w 
		JOIN lot_tracking l_t ON l_t.input_work_id = p_w.work_id
		JOIN prd_work_input_tb p_wi ON p_wi.work_id = p_w.work_id
		LEFT JOIN prd_work_tb i_pw 	ON i_pw.prod_id = p_wi.prod_id 
									AND i_pw.lot_no = p_wi.lot_no
	)
	SELECT 
		l_t.proc_id, l_t.equip_id, l_t.reg_date, 
		l_t.prod_id, l_t.lot_no, l_t.input_prod_id, l_t.input_lot_no,
		m_r.partner_id, m_r.reg_date, sum(m_rd.qty), l_t.sortby,l_t.lv
	FROM lot_tracking l_t 
	LEFT JOIN mat_receive_detail_tb m_rd ON m_rd.prod_id = l_t.input_prod_id
										AND m_rd.lot_no = l_t.input_lot_no
										AND l_t.input_work_id IS NULL
	LEFT JOIN mat_receive_tb m_r ON m_r.receive_id = m_rd.receive_id 
	GROUP BY l_t.proc_id, l_t.equip_id, l_t.reg_date, 
		l_t.prod_id, l_t.lot_no, l_t.input_prod_id, l_t.input_lot_no, 
		m_r.partner_id, m_r.reg_date, m_rd.qty, l_t.sortby,l_t.lv
	ORDER BY l_t.sortby, l_t.reg_date;
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
			s_p.prod_no as work_prod_no,
			s_p.prod_nm as work_prod_no,
			s_it.item_type_cd as work_item_type_cd ,
			s_it.item_type_nm as work_item_type_nm ,
			t_l.lot_no as work_lot_no,
			t_l.reg_date as work_date,
			s_p2.prod_no as input_prod_no,
			s_p2.prod_nm as input_prod_nm,
			s_it2.item_type_cd as input_item_type_cd,
			s_it2.item_type_nm as input_item_type_nm,
			t_l.input_lot_no as input_lot_no,
			s_partner.partner_cd ,
			s_partner.partner_nm ,
			t_l.in_reg_date as receive_date,
			t_l.in_qty as receive_qty,
			t_l.sortby,
			t_l.lv
		FROM temp_lot t_l
		LEFT JOIN std_proc_tb s_proc ON s_proc.proc_id  = t_l.proc_id
		LEFT JOIN std_equip_tb s_equip ON s_equip.equip_id  = t_l.equip_id
		LEFT JOIN std_prod_tb s_p ON s_p.prod_id = t_l.prod_id
		LEFT JOIN std_item_type_tb s_it ON s_it.item_type_id = s_p.item_type_id
		LEFT JOIN std_prod_tb s_p2 ON s_p2.prod_id = t_l.input_prod_id
		LEFT JOIN std_item_type_tb s_it2 ON s_it2.item_type_id = s_p2.item_type_id
		LEFT JOIN std_partner_tb s_partner ON s_partner.partner_id = t_l.partner_id
		ORDER BY t_l.sortby, t_l.reg_date;
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

export { readLotForwardReport }