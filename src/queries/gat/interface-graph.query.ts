// import moment from 'moment';

const readInterfaceGraph = (
  params: {
    start_date: Date,
    end_date: Date,
    factory_uuid?: string,
    data_item_uuid?: string,
		equip_uuid?: string
  }) => {
  let searchQuery: string = '';
	let table: string = '';

	//#region 📌 달 넘어가는 테이블 정리 UNION ALL 
	if (String(params.start_date).substring(0,7) !== String(params.end_date).substring(0,7)) {
		table = `(SELECT * FROM gat_data_history_tb_${String(params.start_date).substring(0,4) + String(params.start_date).substring(5,7)} 
							UNION ALL 
							SELECT * FROM gat_data_history_tb_${String(params.end_date).substring(0,4) + String(params.end_date).substring(5,7)})`
	} else {
		table = `gat_data_history_tb_${String(params.end_date).substring(0,4) + String(params.end_date).substring(5,7)}`
	}
  //#endregion

  //#region 📌 searchQuery
  searchQuery = `WHERE s_di.monitoring_fg = TRUE`;
	searchQuery += ` AND s_dh.created_at BETWEEN '${params.start_date}' AND '${params.end_date}'`; 
	searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; 
	searchQuery += ` AND s_di.uuid = '${params.data_item_uuid}'`; 
	searchQuery += ` AND s_e.uuid = '${params.equip_uuid}'`; 
  
  //#endregion
	
  //#region 📒 Main Query
  const query = `
	SELECT
		s_dm.data_map_nm,
		s_dh.value,
		s_dh.created_at	
	FROM ${table} s_dh
	JOIN std_data_map_tb s_dm ON s_dh.data_gear_id = s_dm.data_gear_id AND s_dh.equip_id = s_dm.equip_id AND s_dh.data_item_id = s_dm.data_item_id AND s_dh.data_channel = s_dm.data_channel   
	JOIN std_data_gear_tb s_dg on s_dh.data_gear_id  = s_dg.data_gear_id
	JOIN std_data_item_tb s_di on s_dh.data_item_id  = s_di.data_item_id
	JOIN std_equip_tb s_e on s_dh.equip_id = s_e.equip_id
	JOIN std_factory_tb s_f ON s_f.factory_id = s_dh.factory_id
	${searchQuery}
	ORDER BY s_dm.data_map_nm, s_dh.created_at;
  `;
  //#endregion

  return query;
}
export { readInterfaceGraph }