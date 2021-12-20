import IStdInspItem from '../../interfaces/std/insp-item.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdInspItem[] = [
  {
		"insp_item_id" : 1,
		"factory_id" : 1,
		"insp_item_type_id" : 1,
		"insp_item_cd" : "001",
		"insp_item_nm" : "가열기 검사항목1",
		"insp_tool_id" : 1,
		"insp_method_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d6a76c1b-e77f-4632-9eed-8e4a4c961c1b"
	},
	{
		"insp_item_id" : 2,
		"factory_id" : 1,
		"insp_item_type_id" : 2,
		"insp_item_cd" : "002",
		"insp_item_nm" : "가열기 검사항목2",
		"insp_tool_id" : 2,
		"insp_method_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ff85f797-1e72-42cb-9606-d39512cb23cc"
	},
	{
		"insp_item_id" : 3,
		"factory_id" : 1,
		"insp_item_type_id" : 3,
		"insp_item_cd" : "003",
		"insp_item_nm" : "가열기 검사항목3",
		"insp_tool_id" : 3,
		"insp_method_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1cb8e814-98d4-46b7-bedc-8e73fcb940c4"
	},
	{
		"insp_item_id" : 4,
		"factory_id" : 1,
		"insp_item_type_id" : 4,
		"insp_item_cd" : "004",
		"insp_item_nm" : "가열기 검사항목4",
		"insp_tool_id" : 4,
		"insp_method_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "531b8d15-b881-417d-933e-45e32fa6dd64"
	},
	{
		"insp_item_id" : 5,
		"factory_id" : 1,
		"insp_item_type_id" : 5,
		"insp_item_cd" : "005",
		"insp_item_nm" : "가열기 검사항목5",
		"insp_tool_id" : 5,
		"insp_method_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "11a1d0fa-7323-4f4f-a152-c8c71b744714"
	}
]

const baseMigration = new BaseMigration('StdInspItem', 'insp_item_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };