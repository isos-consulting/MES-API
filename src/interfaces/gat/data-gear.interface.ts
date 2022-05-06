export default interface IStdDataGear {
  data_gear_id?: number,
	data_gear_cd?: string,
	data_gear_nm?: string,
	factory_id?: number,
	ip?: string | null,
	port?: string | null,
	gear_type?: string | null,
	connection_type?: string | null,
	manufacturer?: string | null,
	protocol?: string | null,
  created_at?: Date,
  created_uid?: number,
  updated_at?: Date,
  updated_uid?: number,
  uuid?: string
}