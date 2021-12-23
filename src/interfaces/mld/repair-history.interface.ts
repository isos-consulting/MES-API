export default interface IMldRepairHistory {
	repair_history_id?: number, 
	factory_id?: number, 
	mold_id?: number, 
	prod_id?: number | null,
	problem_id?: number,
	occur_date?: Date | null,
	occur_emp_id?: number | null, 
	repair_emp_id?: number | null, 
	repair_partner?: string | null,
	repair_no?: string | null, 
	start_date?: Date,
	end_date?: Date | null,
	contents?: string | null,
	created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}