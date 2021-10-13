export default interface IAdmLog {
  log_id?: number,
  table_nm?: string,
  logged_at?: Date,
  logged_uid?: number,
  tran_fg?: boolean,
  tran_values?: object,
  tenant_uuid?: string
}