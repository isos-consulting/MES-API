export default interface IAutMenu {
  menu_id?: number,
  menu_type_id?: number | null,
  menu_nm?: string,
  menu_uri?: string | null,
  menu_form_nm?: string | null,
  component_nm?: string | null,
  icon?: string | null,
  parent_id?: number,
  sortby?: number,
  use_fg?: boolean,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}