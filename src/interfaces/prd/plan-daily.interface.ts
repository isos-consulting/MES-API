export default interface IPrdPlanDaily {
  plan_daily_id?: number,
	plan_monthly_id?: number,
  factory_id?: number,
  prod_id?: number,
  workings_id?: number,
  plan_day?: Date,
  plan_daily_qty?: number,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string,
}