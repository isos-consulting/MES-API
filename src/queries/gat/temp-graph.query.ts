import moment from 'moment';

const readTempGraph = (
  params: {
    start_date: Date,
    end_date: Date,
    factory_uuid?: string,
    data_map_uuid?: string
  }) => {
  let searchQuery: string = '';
	let table: string = '';

	//#region 📌 end date 기준 start date 설정
	let startDate = moment(params.end_date).subtract(1, "h").format('YYYY-MM-DD HH:mm');
	//#endregion

	//#region 📌 달 넘어가는 테이블 정리 UNION ALL 
	if (String(startDate).substring(0,7) !== String(params.end_date).substring(0,7)) {
		table = `(SELECT * FROM gat_data_history_tb_${String(startDate).substring(0,4) + String(startDate).substring(5,7)} 
							UNION ALL 
							SELECT * FROM gat_data_history_tb_${String(params.end_date).substring(0,4) + String(params.end_date).substring(5,7)})`
	} else {
		table = `gat_data_history_tb_${String(params.end_date).substring(0,4) + String(params.end_date).substring(5,7)}`
	}
  //#endregion

  //#region 📌 searchQuery
  searchQuery = `WHERE s_dm.monitoring_fg = TRUE`;
	searchQuery += ` AND s_dh.created_at BETWEEN '${startDate}' AND '${params.end_date}'`; 
  if (params.factory_uuid) { searchQuery += ` AND s_f.uuid = '${params.factory_uuid}'`; }
  if (params.data_map_uuid) { searchQuery += ` AND s_dm.uuid = '${params.data_map_uuid}'`; }  
  //#endregion
	
  //#region 📒 Main Query
  const query = `
	SELECT
		s_dh.created_at,	
		s_dm.data_map_id,
		s_dm.data_map_nm,
		s_dh.value
	FROM ${table} s_dh
	JOIN std_data_map_tb s_dm ON s_dh.data_gear_id = s_dm.data_gear_id AND s_dh.data_item_id = s_dm.data_item_id AND s_dh.data_item_id = s_dm.data_item_id AND s_dh.data_channel = s_dm.data_channel   
	JOIN std_data_gear_tb s_dg on s_dh.data_gear_id  = s_dg.data_gear_id
	JOIN std_data_item_tb s_di on s_dh.data_item_id  = s_di.data_item_id
	JOIN std_equip_tb s_e on s_dh.equip_id = s_e.equip_id
	JOIN std_factory_tb s_f ON s_f.factory_id = s_dh.factory_id
	${searchQuery};
  `;
  //#endregion

  return query;
}
export { readTempGraph }