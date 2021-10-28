import IStdDowntime from '../../interfaces/std/downtime.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdDowntime[] = [
  {
		"downtime_id" : 1,
		"factory_id" : 1,
		"downtime_type_id" : 1,
		"downtime_cd" : "001",
		"downtime_nm" : "조식",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ff40b645-00cb-48fa-ae69-b3829fcb4f82"
	},
	{
		"downtime_id" : 2,
		"factory_id" : 1,
		"downtime_type_id" : 1,
		"downtime_cd" : "002",
		"downtime_nm" : "중식",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e890fe2e-fc38-4842-b3de-627538a3689a"
	},
	{
		"downtime_id" : 3,
		"factory_id" : 1,
		"downtime_type_id" : 1,
		"downtime_cd" : "003",
		"downtime_nm" : "석식",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "35ce7187-9b84-4a43-a0b0-9e1c5a9c535c"
	},
	{
		"downtime_id" : 4,
		"factory_id" : 1,
		"downtime_type_id" : 2,
		"downtime_cd" : "004",
		"downtime_nm" : "로스발생",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6b383dd2-1437-4496-8441-daa79b78841d"
	},
	{
		"downtime_id" : 5,
		"factory_id" : 1,
		"downtime_type_id" : 3,
		"downtime_cd" : "005",
		"downtime_nm" : "돌발상황",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0b8ee087-d0ca-4ffd-b587-5266a8cd6035"
	}
]

const baseMigration = new BaseMigration('StdDowntime', 'downtime_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };