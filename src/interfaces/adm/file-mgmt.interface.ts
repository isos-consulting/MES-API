export default interface IAdmFileMgmt {
  file_mgmt_id?: number,
  file_mgmt_cd?: string,
  reference_id?: number,
  reference_uuid?: string | null,
  file_nm?: string,
  file_extension?: string,
  ip?: string | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}