export default interface IAdmMenuFile {
  menu_file_id?: number,
  menu_id?: number,
  file_type?: string,
  file_name?: string,
	file_extension?: string
  use_fg?: boolean,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
	uuid?: string
}