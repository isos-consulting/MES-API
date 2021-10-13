export default interface IAdmStdOpt {
  std_opt_id?: number,
  std_opt_cd?: string,
  std_opt_nm?: string,
  std_id?: number,
  col_use_fg?: boolean,
  col_gb?: string,
  alias?: string,
  sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}