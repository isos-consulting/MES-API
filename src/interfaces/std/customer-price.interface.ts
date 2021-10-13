export default interface IStdCustomerPrice {
  customer_price_id?: number,
  partner_id?: number,
  prod_id?: number,
  money_unit_id?: number,
  price_type_id?: number,
  price?: number,
  start_date?: string,
  end_date?: string,
  retroactive_price?: number | null,
  division?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}