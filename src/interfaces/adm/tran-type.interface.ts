export default interface IAdmTranType {
  tran_type_id?: number,
  tran_type_cd?: string,
  tran_type_nm?: string,
	sortby?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}