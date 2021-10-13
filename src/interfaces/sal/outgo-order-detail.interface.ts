export default interface ISalOutgoOrderDetail {
  outgo_order_detail_id?: number,
  outgo_order_id?: number,
  seq?: number,
  factory_id?: number,
  prod_id?: number,
  qty?: number,
  order_detail_id?: number | null,
  complete_fg?: boolean,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}