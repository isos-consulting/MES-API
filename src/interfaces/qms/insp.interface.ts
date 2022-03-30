export default interface IQmsInsp {
  insp_id?: number,
  factory_id?: number,
  insp_type_id?: number,
  insp_no?: string,
  prod_id?: number,
  reg_date?: string,
  apply_date?: string | null,
  apply_fg?: boolean,
  contents?: string | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}