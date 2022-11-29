export default interface IInvEcerp {
  ecerp_id?: number,
  type?: string,
  header_id?: number,
  detail_id?: number,
  qty?: number,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}