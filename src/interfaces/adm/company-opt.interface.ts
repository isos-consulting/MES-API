export default interface IAdmCompanyOpt {
  company_opt_id?: number,
  company_opt_cd?: string,
  company_opt_nm?: string,
  remark?: string | null,
  val?: string | null,
  val_opt?: string | null,
  sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
	uuid?: string
}