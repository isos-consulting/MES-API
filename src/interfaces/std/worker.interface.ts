export default interface IStdWorker {
  worker_id?: number,
  factory_id?: number,
  proc_id?: number | null,
  workings_id?: number | null,
  emp_id?: number | null,
  worker_cd?: string,
  worker_nm?: string,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}