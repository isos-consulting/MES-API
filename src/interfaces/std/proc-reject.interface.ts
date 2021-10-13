export default interface IStdProcReject {
  proc_reject_id?: number,
  factory_id?: number,
  proc_id?: number,
  reject_id?: number,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}