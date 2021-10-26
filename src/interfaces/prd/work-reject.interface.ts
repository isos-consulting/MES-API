export default interface IPrdWorkReject {
  work_reject_id?: number,
  factory_id?: number,
  work_id?: number,
  work_routing_id?: number | null,
  reject_id?: number,
  qty?: number,
  to_store_id?: number,
  to_location_id?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}