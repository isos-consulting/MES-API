export default interface IAdmLoginLog {
  log_id?: number,
	company_cd?: string | null,	
  user_id?: string | null,
	user_nm?: string | null,
	state_cd?: string | null,
	ip_address?: string | null,
	browser?: string | null,
	logged_at?: string | null,
	uuid?: string
}