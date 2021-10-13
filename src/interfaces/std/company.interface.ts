export default interface IStdCompany {
  company_id?: number,
  company_nm?: string,
  company_no?: string | null,
  boss_nm?: string | null,
  tel?: string | null,
  fax?: string | null,
  post?: string | null,
  addr?: string | null,
  addr_detail?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}