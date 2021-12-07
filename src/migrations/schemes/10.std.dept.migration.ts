import IStdDept from '../../interfaces/std/dept.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdDept[] = [
  {
		"dept_id" : 1,
		"dept_cd" : "001",
		"dept_nm" : "경영관리",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9f01ec5b-ec13-4560-ba8e-826af239f2e1"
	},
	{
		"dept_id" : 2,
		"dept_cd" : "002",
		"dept_nm" : "생산관리",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4e8dbd44-b04e-4faa-b5cd-c77533c0fea0"
	},
	{
		"dept_id" : 3,
		"dept_cd" : "003",
		"dept_nm" : "품질관리",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7e3ceb40-b80e-4da2-a09b-5da1173a3cf2"
	},
	{
		"dept_id" : 4,
		"dept_cd" : "004",
		"dept_nm" : "생산",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "72d3b8ca-58d7-4719-973f-61feefabda3b"
	},
	{
		"dept_id" : 5,
		"dept_cd" : "005",
		"dept_nm" : "개발",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3f36ec7b-0c9a-4e22-bb86-b95b6d1d95fb"
	}
]

const baseMigration = new BaseMigration('StdDept', 'dept_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };