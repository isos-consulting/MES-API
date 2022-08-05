export default interface IAdmExcelForm {
  excel_form_id?: number,
	menu_id?: number,
	excel_form_nm?: string,
  excel_form_cd?: string,
	excel_form_column_nm?: string,
	excel_form_column_cd?: string,
	excel_form_type?: string,
  reference_menu?: string,
	column_fg?: boolean | null,
  sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
	uuid?: string
} 