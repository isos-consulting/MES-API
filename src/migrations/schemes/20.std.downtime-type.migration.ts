import IStdDowntimeType from '../../interfaces/std/downtime-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdDowntimeType[] = [
  {
		"downtime_type_id" : 1,
		"factory_id" : 1,
		"downtime_type_cd" : "001",
		"downtime_type_nm" : "계획정지",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b6c4d4f4-41b7-46e3-afe7-5c07a38f372f"
	},
	{
		"downtime_type_id" : 2,
		"factory_id" : 1,
		"downtime_type_cd" : "002",
		"downtime_type_nm" : "가동로스",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "01af5989-3fe6-490b-9602-87136d925a49"
	},
	{
		"downtime_type_id" : 3,
		"factory_id" : 1,
		"downtime_type_cd" : "003",
		"downtime_type_nm" : "무계획정지",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7745d4fe-08eb-4e94-97ee-94108902cb19"
	}
]

const baseMigration = new BaseMigration('StdDowntimeType', 'downtime_type_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };