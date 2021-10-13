export default interface IQmsInspResultDetailInfo {
  insp_result_detail_info_id?: number,
  factory_id?: number,
  insp_result_id?: number,
  insp_detail_id?: number,
  insp_result_fg?: boolean,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}