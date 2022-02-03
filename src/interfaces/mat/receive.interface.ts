export default interface IMatReceive {
  receive_id?: number,
  factory_id?: number,
  partner_id?: number,
  supplier_id?: number | null,
  stmt_no?: string | null,
  reg_date?: string,
  total_price?: number | null,
  total_qty?: number | null,
  order_id?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}