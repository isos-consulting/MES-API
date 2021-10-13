export default interface IPrdDemand {
  demand_id?: number,
  factory_id?: number,
  order_id?: number | null,
  reg_date?: Date,
  demand_type_cd?: string,
  proc_id?: number | null,
  equip_id?: number | null,
  prod_id?: number,
  qty?: number,
  complete_fg?: boolean,
  dept_id?: number | null,
  due_date?: Date | null,
  to_store_id?: number,
  to_location_id?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
  tenant_uuid?: string
}