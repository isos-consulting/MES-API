import IStdInspMethod from '../../interfaces/std/insp-method.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdInspMethod[] = [
  {
		"insp_method_id" : 1,
		"factory_id" : 1,
		"insp_method_cd" : "001",
		"insp_method_nm" : "설계검사",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f3b2c00c-2f46-4132-8d38-7f272ab450ad"
	},
	{
		"insp_method_id" : 2,
		"factory_id" : 1,
		"insp_method_cd" : "002",
		"insp_method_nm" : "금형가공검사",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d7922ee4-e2a3-4796-a7ef-79256237033d"
	},
	{
		"insp_method_id" : 3,
		"factory_id" : 1,
		"insp_method_cd" : "003",
		"insp_method_nm" : "원자재검사",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fef0601c-39cf-4910-95e3-1e8999c26f3d"
	},
	{
		"insp_method_id" : 4,
		"factory_id" : 1,
		"insp_method_cd" : "004",
		"insp_method_nm" : "절단검사",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d1132baf-e2d6-47df-abc9-f43580492f2d"
	},
	{
		"insp_method_id" : 5,
		"factory_id" : 1,
		"insp_method_cd" : "005",
		"insp_method_nm" : "가열검사",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "98203616-5ecf-42c5-aaac-c9a8d4313058"
	}
]

const baseMigration = new BaseMigration('StdInspMethod', 'insp_method_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };