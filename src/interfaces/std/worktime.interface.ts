export default interface IStdWorktime {
  worktime_id?: number,
  worktime_cd?: string,
  worktime_nm?: string,
  work_type_id?: number,
  worktime_type_id?: number,
  use_fg?: boolean,
  break_time_fg?: boolean,
  start_time?: string,
  end_time?: string,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}