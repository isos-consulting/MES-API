export default interface IMatReceiveDetail {
  receive_detail_id?: number,
  receive_id?: number,
  seq?: number,
  factory_id?: number,
  prod_id?: number,
  unit_id?: number,
  lot_no?: string,
  manufactured_lot_no?: string | null,
  qty?: number,
  price?: number,
  money_unit_id?: number,
  exchange?: number,
  total_price?: number,
  unit_qty?: number | null,
  insp_fg?: boolean,
  carry_fg?: boolean,
  order_detail_id?: number | null,
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