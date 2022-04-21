export default interface IStdRouting {
  routing_id?: number,
  factory_id?: number,
  prod_id?: number,
  proc_id?: number,
  proc_no?: number,
  auto_work_fg?: boolean,
  cycle_time?: number | null,
  uph?: number | null,
  prd_signal_cnt?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}