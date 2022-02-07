export default interface ISaltReturnDetail {
  return_detail_id?: number,
  return_id?: number,
  seq?: number,
  factory_id?: number,
  prod_id?: number,
  lot_no?: string,
  qty?: number,
  price?: number,
  money_unit_id?: number,
  exchange?: number,
  total_price?: number,
  reject_id: number | null,
  outgo_detail_id: number | null,
  to_store_id: number,
  to_location_id: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}