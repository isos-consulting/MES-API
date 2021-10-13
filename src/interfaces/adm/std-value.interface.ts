export default interface IAdmStdValue {
  std_value_id?: number,
  std_value_cd?: string,
  value?: string,
  std_id?: number,
  sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}