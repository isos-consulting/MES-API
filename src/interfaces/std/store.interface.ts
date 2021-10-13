export default interface IStdStore {
  store_id?: number,
  factory_id?: number,
  store_cd?: string,
  store_nm?: string,
  reject_store_fg?: boolean,
  return_store_fg?: boolean,
  outgo_store_fg?: boolean,
  final_insp_store_fg?: boolean,
  available_store_fg?: boolean,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}