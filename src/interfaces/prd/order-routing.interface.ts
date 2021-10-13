export default interface IPrdOrderRouting { // 공정 순서(지시)
  order_routing_id?: number,
  factory_id?: number,
  order_id?: number,
  proc_id?: number,
  proc_no?: number,
  workings_id?: number,
  equip_id?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}