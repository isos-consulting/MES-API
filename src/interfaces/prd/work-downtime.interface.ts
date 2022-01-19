export default interface IPrdWorkDowntime {
  work_downtime_id?: number,
  factory_id?: number,
  work_id?: number | null,
  work_routing_id?: number | null,
  equip_id?: number | null,
  downtime_id?: number,
  start_date?: string,
  end_date?: string,
  downtime?: number,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}