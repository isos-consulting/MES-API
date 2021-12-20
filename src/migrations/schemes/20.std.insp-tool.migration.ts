import IStdInspTool from '../../interfaces/std/insp-tool.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdInspTool[] = [
  {
		"insp_tool_id" : 1,
		"factory_id" : 1,
		"insp_tool_cd" : "C001",
		"insp_tool_nm" : "육안",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "89c72d39-7823-4501-a7bf-d476dea9dac4"
	},
	{
		"insp_tool_id" : 2,
		"factory_id" : 1,
		"insp_tool_cd" : "C002",
		"insp_tool_nm" : "하이트게이지",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "501398a4-2404-4696-ac10-aee1d8c2b92b"
	},
	{
		"insp_tool_id" : 3,
		"factory_id" : 1,
		"insp_tool_cd" : "C003",
		"insp_tool_nm" : "비중계",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "110dea25-5604-4d18-ba0a-66ece7fa3b61"
	},
	{
		"insp_tool_id" : 4,
		"factory_id" : 1,
		"insp_tool_cd" : "C004",
		"insp_tool_nm" : "V\/C",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f0a86819-3f92-410a-a38f-e00d472e82ea"
	},
	{
		"insp_tool_id" : 5,
		"factory_id" : 1,
		"insp_tool_cd" : "C005",
		"insp_tool_nm" : "블레이드M\/M",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "eaf08d5d-03dc-43d6-97ff-5337edb4aff0"
	}
]

const baseMigration = new BaseMigration('StdInspTool', 'insp_tool_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };