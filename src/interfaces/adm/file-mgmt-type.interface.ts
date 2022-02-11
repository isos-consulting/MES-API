export default interface IAdmFileMgmtType {
  file_mgmt_type_id?: number,
  file_mgmt_type_cd?: string,
	file_mgmt_type_nm?: string,
	sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}