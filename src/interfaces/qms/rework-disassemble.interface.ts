export default interface IQmsReworkDisassemble {
  rework_disassemble_id?: number,
  factory_id?: number,
  rework_id?: number,
  prod_id?: number,
  lot_no?: string,
  income_qty?: number | null,
  return_qty?: number | null,
  disposal_qty?: number | null,
  income_store_id?: number | null,
  income_location_id?: number | null,
  return_store_id?: number | null,
  return_location_id?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}