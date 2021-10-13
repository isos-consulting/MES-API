export default interface IAutPermission {
  permission_id?: number,
  permission_nm?: string,
  create_fg?: boolean,
  read_fg?: boolean,
  update_fg?: boolean,
  delete_fg?: boolean,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}