export default interface IStdDowntime {
  downtime_id?: number,
  factory_id?: number,
  downtime_type_id?: number,
  downtime_cd?: string,
  downtime_nm?: string,
  eqm_failure_fg?: boolean,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}