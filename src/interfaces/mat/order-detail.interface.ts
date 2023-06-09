export default interface IMatOrderDetail {
  order_detail_id?: number,
  order_id?: number,
  seq?: number,
  factory_id?: number,
  prod_id?: number,
  unit_id?: number,
  qty?: number,
  price?: number,
  money_unit_id?: number,
  exchange?: number,
  total_price?: number,
  unit_qty?: number | null,
  due_date?: string | null,
  complete_fg?: boolean,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}