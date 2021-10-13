export default interface IStdUnitConvert {
  unit_convert_id?: number,
  from_unit_id?: number,
  to_unit_id?: number,
  from_value?: number,
  to_value?: number,
  convert_value?: number,
  prod_id?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}