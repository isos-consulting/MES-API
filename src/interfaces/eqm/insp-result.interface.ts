export default interface IEqmInspResult {
  insp_result_id?: number,
  factory_id?: number,
  insp_detail_id?: number,
  equip_id?: number,
  emp_id?: number,
  reg_date?: string,
  insp_value?: string,
  insp_result_fg?: boolean,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}