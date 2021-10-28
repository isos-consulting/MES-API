import IStdReject from '../../interfaces/std/reject.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdReject[] = [
  {
		"reject_id" : 1,
		"factory_id" : 1,
		"reject_type_id" : 1,
		"reject_cd" : "001",
		"reject_nm" : "가공불량",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6d3c208b-3d04-4ab1-aa92-f1484a67d95a"
	},
	{
		"reject_id" : 2,
		"factory_id" : 1,
		"reject_type_id" : 2,
		"reject_cd" : "002",
		"reject_nm" : "소재불량",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "19507f8c-9e8d-4f72-87d4-6b7a5f762c98"
	},
	{
		"reject_id" : 3,
		"factory_id" : 1,
		"reject_type_id" : 3,
		"reject_cd" : "003",
		"reject_nm" : "셋팅불량",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "48032181-e125-48e8-8b5c-a28b54259286"
	},
	{
		"reject_id" : 4,
		"factory_id" : 1,
		"reject_type_id" : 1,
		"reject_cd" : "004",
		"reject_nm" : "찍힘",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cbe1a8c6-9e8e-4959-a648-d98748da629d"
	},
	{
		"reject_id" : 5,
		"factory_id" : 1,
		"reject_type_id" : 2,
		"reject_cd" : "005",
		"reject_nm" : "크랙",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ebefcb83-9e01-4004-8cac-d06701ac3e6b"
	}
]

const baseMigration = new BaseMigration('StdReject', 'reject_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };