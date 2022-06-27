export default interface IStdBarcodeHistory {
  barcode_history_id?: number,
  barcode?: string,
  factory_id?: number,
  prod_id?: number,
  lot_no?: string,
  qty?: number,
  reg_date?: Date,
  tran_type_id?: number | null,
  reference_id?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}