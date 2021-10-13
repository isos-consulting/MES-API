export default interface IAdmReworkType {
  rework_type_id?: number,
  rework_type_cd?: string,
  rework_type_nm?: string,
  sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  tenant_uuid?: string
}