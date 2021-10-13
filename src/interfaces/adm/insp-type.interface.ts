export default interface IAdmInspType {
  insp_type_id?: number,
  insp_type_cd?: string,
  insp_type_nm?: string,
  worker_fg?: boolean,
  inspector_fg?: boolean,
  sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  tenant_uuid?: string
}