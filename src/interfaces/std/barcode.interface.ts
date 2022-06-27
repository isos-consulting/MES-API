export default interface IStdBarcode {
  barcode_id?: number,
  barcode?: string,
  factory_id?: number,
  prod_id?: number,
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