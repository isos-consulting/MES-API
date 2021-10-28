export default interface IPrdWorkWorker {
  work_worker_id?: number,
  factory_id?: number,
  work_id?: number,
  worker_id?: number,
  start_date?: Date | null,
  end_date?: Date | null,
  work_time?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}