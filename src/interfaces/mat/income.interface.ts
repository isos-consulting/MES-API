export default interface IMatIncome {
  income_id?: number,
  factory_id?: number,
  reg_date?: string,
  prod_id?: number,
  lot_no?: string,
  qty?: number,
  receive_detail_id?: number | null,
  to_store_id?: number,
  to_location_id?: number | null,
  remark?: string | null,
  barcode?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}