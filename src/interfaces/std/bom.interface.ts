export default interface IStdBom {
  bom_id?: number,
  factory_id?: number,
  p_prod_id?: number,
  c_prod_id?: number,
  c_usage?: number,
  unit_id?: number,
  sortby?: number,
  from_store_id?: number,
  from_location_id?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}