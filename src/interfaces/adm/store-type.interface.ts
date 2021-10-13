export default interface IAdmStoreType {
  store_type_id?: number,
  store_type_cd?: string,
  store_type_nm?: string,
  parameter_nm?: string,
  sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  tenant_uuid?: string
}