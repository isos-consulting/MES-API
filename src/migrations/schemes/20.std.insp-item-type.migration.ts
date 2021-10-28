import IStdInspItemType from '../../interfaces/std/insp-item-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdInspItemType[] = [
  {
		"insp_item_type_id" : 1,
		"factory_id" : 1,
		"insp_item_type_cd" : "001",
		"insp_item_type_nm" : "외관",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "36e1f792-7a0d-46fc-b873-6c0e38775b3a"
	},
	{
		"insp_item_type_id" : 2,
		"factory_id" : 1,
		"insp_item_type_cd" : "002",
		"insp_item_type_nm" : "치수",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5fb467a2-c1a9-438e-8638-ffee4a47f2fd"
	},
	{
		"insp_item_type_id" : 3,
		"factory_id" : 1,
		"insp_item_type_cd" : "003",
		"insp_item_type_nm" : "성능",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7e8dcd1c-3941-40c0-bfff-b66b684b6927"
	},
	{
		"insp_item_type_id" : 4,
		"factory_id" : 1,
		"insp_item_type_cd" : "004",
		"insp_item_type_nm" : "내구",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a4dda42b-236a-446a-9b77-a8fa2aa8d5f7"
	},
	{
		"insp_item_type_id" : 5,
		"factory_id" : 1,
		"insp_item_type_cd" : "005",
		"insp_item_type_nm" : "강도",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fc6e3cf1-68d5-4026-96be-51a2e3bcebd9"
	}
]

const baseMigration = new BaseMigration('StdInspItemType', 'insp_item_type_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };