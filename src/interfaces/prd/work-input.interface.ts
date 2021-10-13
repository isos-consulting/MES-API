export default interface IPrdWorkInput { // 투입 이력(실적)
  work_input_id?: number,
  factory_id?: number,
  work_id?: number,
  prod_id?: number,
  lot_no?: string,
  qty?: number,
  c_usage?: number,
  unit_id?: number,
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