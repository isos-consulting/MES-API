export default interface IInvStore {
  tran_id?: number,
  inout_fg?: boolean,
  tran_cd?: string,
  reg_date?: string,
  factory_id?: number,
  store_id?: number,
  location_id?: number | null,
  prod_id?: number,
  reject_id?: number | null,
	partner_id?: number| null,
  lot_no?: string,
  qty?: number,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
	
}