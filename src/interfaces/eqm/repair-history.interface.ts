export default interface IEqmRepairHistory {
  repair_history_id?: number,
  factory_id?: number,
  equip_id?: number,
  occur_start_date?: string,
  occur_end_date?: string | null,
  occur_emp_id?: number | null,
  occur_reason?: string | null,
  occur_contents?: string | null,
  repair_start_date?: string | null,
  repair_end_date?: string | null,
  repair_time?: number | null,
  repair_place?: string | null,
  repair_price?: number | null,
  check_date?: Date | null,
  check_emp_id?: number | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}