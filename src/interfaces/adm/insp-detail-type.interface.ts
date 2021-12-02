export default interface IAdmInspDetailType {
  insp_detail_type_id?: number,
  insp_detail_type_cd?: string,
  insp_detail_type_nm?: string,
  insp_type_cd?: string,
  sortby?: number | null,
  worker_fg?: boolean,
  inspector_fg?: boolean,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
	uuid?: string
}