export default interface IStdDataMap {
	data_map_id?: number,
	data_map_nm?: string| null,
	data_gear_id?: number,
	data_item_id?: number,
	equip_id?: number,
	data_channel?: string,
	history_yn?: boolean,
	weight?: number | null,
	work_fg?: boolean | null,
	community_function?: string | null,
	slave?: string | null,
	alarm_fg?: boolean | null,
	ieee752_fg?: boolean | null,
	monitoring_fg?: boolean | null,
	created_at?: Date,
	created_uid?: number,
	updated_at?: Date,
	updated_uid?: number,
	uuid?: string,
}



