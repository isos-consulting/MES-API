export default interface ISalOrder {
  order_id?: number,
  factory_id?: number,
  partner_id?: number,
  stmt_no?: string | null,
  reg_date?: Date,
  total_price?: number | null,
  total_qty?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}