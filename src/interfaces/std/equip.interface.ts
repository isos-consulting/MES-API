export default interface IStdEquip {
  equip_id?: number,
  factory_id?: number,
  equip_type_id?: number | null,
  equip_cd?: string,
  equip_nm?: string,
  use_fg?: boolean,
  prd_fg?: boolean,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}