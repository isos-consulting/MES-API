export default interface IStdDataItem {
  data_item_id?: number,
  data_item_cd?: string,
	data_item_nm?: string,
	monitoring_fg?: boolean | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}