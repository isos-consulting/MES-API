import IStdProc from '../../interfaces/std/proc.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IStdProc[] = [
  {
		"proc_id" : 1,
		"factory_id" : 1,
		"proc_cd" : "001",
		"proc_nm" : "쇼트",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ab1fbd1f-34bb-4e24-9e7f-36a4be4bdc03"
	},
	{
		"proc_id" : 2,
		"factory_id" : 1,
		"proc_cd" : "002",
		"proc_nm" : "수동조립",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0bf875b7-b533-41d4-8af2-80da9412b126"
	},
	{
		"proc_id" : 3,
		"factory_id" : 1,
		"proc_cd" : "003",
		"proc_nm" : "조립",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9ebed0c0-22cc-40ad-a741-6bb7a894343b"
	},
	{
		"proc_id" : 4,
		"factory_id" : 1,
		"proc_cd" : "004",
		"proc_nm" : "침유",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "01ea2f15-c25a-409c-a5ec-ca35a493485a"
	},
	{
		"proc_id" : 5,
		"factory_id" : 1,
		"proc_cd" : "005",
		"proc_nm" : "컴프레셔",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7daae866-0d85-4496-a23b-be95d561759c"
	}
]

const baseMigration = new BaseMigration('StdProc', 'proc_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };