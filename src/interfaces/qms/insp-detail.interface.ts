export default interface IQmsInspDetail {
  insp_detail_id?: number,
  insp_id?: number,
  seq?: number,
  factory_id?: number,
  insp_item_id?: number,
  insp_item_desc?: string | null,
  spec_std?: string,
  spec_min?: number | null,
  spec_max?: number | null,
  insp_method_id?: number | null,
  insp_tool_id?: number | null,
  sortby: number | null,
  position_no: number | null,
  special_property: string | null,
  worker_sample_cnt: number | null,
  worker_insp_cycle: string | null,
  inspector_sample_cnt: number | null,
  inspector_insp_cycle: string | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}