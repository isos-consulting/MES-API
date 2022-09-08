export default interface IPrdWorkRoutingOrigin { // 공정 순서 기준(실적)
  work_routing_origin_id?: number,
	work_id?: number,
  factory_id?: number,
  proc_id?: number,
  proc_no?: number,
  workings_id?: number,
  equip_id?: number | null,
  mold_id?: number | null,
  mold_cavity?: number | null,
  prd_signal_cnt?: number | null,
  remark?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}