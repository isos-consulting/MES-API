export default interface IAdmCompanyOpt {
  compnay_opt_id?: number,
  compnay_opt_cd?: string,
  compnay_opt_nm?: string,
  remark?: string,
  val?: string,
  val_opt?: string,
  sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  tenant_uuid?: string
}