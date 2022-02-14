export default interface ISalIncome {
  income_id?: number,
  factory_id?: number,
  reg_date?: string,
  prod_id?: number,
  lot_no?: string,
  qty?: number,
  from_store_id?: number,
  from_location_id?: number | null,
  to_store_id?: number,
  to_location_id?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}