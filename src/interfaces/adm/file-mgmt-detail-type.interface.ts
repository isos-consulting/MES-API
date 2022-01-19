export default interface IAdmFileMgmtDetailType {
  file_mgmt_detail_type_id?: number,
  file_mgmt_detail_type_cd?: string,
	file_mgmt_detail_type_nm?: string,
  file_mgmt_type_id?: number,
  file_extension_types?: string | null,
  sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}