export default interface IAdmPatternOpt {
  pattern_opt_id?: number,
  pattern_opt_cd?: string,
  pattern_opt_nm?: string,
  table_nm?: string | null,
  auto_fg?: boolean,
  col_nm?: string | null,
  pattern?: string | null,
  sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
	uuid?: string
}