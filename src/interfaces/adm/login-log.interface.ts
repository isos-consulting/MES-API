export default interface IAdmLoginLog {
  log_id?: number,
	company_cd?: string | null,	
  id?: string | null,
	user_nm?: string | null,
	state_cd?: string | null,
	ip_address?: string | null,
	browser?: string | null,
	os?: string | null,
	created_at?: string | null,
	uuid?: string
}