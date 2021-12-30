export default interface IStdInspItem {
  insp_item_id?: number,
  factory_id?: number,
  insp_item_type_id?: number | null,
  insp_item_cd?: string,
  insp_item_nm?: string,
  insp_tool_id?: number | null,
  insp_method_id?: number | null,
  eqm_fg?: boolean,
  qms_fg?: boolean,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}