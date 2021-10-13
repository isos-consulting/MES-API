export default interface IQmsInsp {
  insp_id?: number,
  factory_id?: number,
  insp_type_cd?: string,
  insp_no?: string,
  prod_id?: number,
  reg_date?: Date,
  apply_date?: Date | null,
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