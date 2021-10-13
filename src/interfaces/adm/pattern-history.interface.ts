export default interface IAdmPatternHistory {
  pattern_history_id?: number,
  factory_id?: number,
  table_nm?: string,
  col_nm?: string,
  pattern?: string,
  reg_date?: string,
  seq?: number,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}