export default interface IAdmBomType {
  bom_type_id?: number,
  bom_type_cd?: string,
  bom_type_nm?: string,
  sortby?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  tenant_uuid?: string
}