export default interface IEqmHistory {
  history_id?: number,
  factory_id?: number,
  equip_id?: number,
  reg_date?: string,
  contents?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}