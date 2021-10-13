export default interface ISalOutgoOrder {
  outgo_order_id?: number,
  factory_id?: number,
  partner_id?: number,
  delivery_id?: number | null,
  reg_date?: Date,
  order_id?: number | null,
  total_qty?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}