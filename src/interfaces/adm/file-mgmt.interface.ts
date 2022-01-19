export default interface IAdmFileMgmt {
  file_mgmt_id?: number,
  file_mgmt_detail_type_id?: number,
  reference_uuid?: string | null,
  file_nm?: string,
  file_extension?: string,
  file_size?: number,
  ip?: string | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}