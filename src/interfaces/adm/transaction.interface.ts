export default interface IAdmTransaction {
  tran_id?: number,
  tran_cd?: string,
  tran_nm?: string,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}