export default interface IStdRoutingResource {
  routing_resource_id?: number,
  factory_id?: number,
  routing_id?: number,
  resource_type?: string,
  equip_id?: number | null,
  emp_cnt?: number | null,
  cycle_time?: number | null,
  uph?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}