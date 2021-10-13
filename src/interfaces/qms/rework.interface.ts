export default interface IQmsRework {
  rework_id?: number,
  factory_id?: number,
  reg_date?: Date,
  prod_id?: number,
  lot_no?: string,
  rework_type_cd?: string,
  reject_id?: number,
  qty?: number,
  from_store_id?: number,
  from_location_id?: number | null,
  to_store_id?: number | null,
  to_location_id?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}