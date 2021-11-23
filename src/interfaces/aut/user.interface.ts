export default interface IAutUser {
  uid?: number,
  id?: string,
  group_id?: number | null,
  user_nm?: string,
  pwd?: string,
  email?: string,
  pwd_fg?: boolean,
  admin_fg?: boolean,
  super_admin_fg?: boolean,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}