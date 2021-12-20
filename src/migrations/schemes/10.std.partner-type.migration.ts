import IStdPartnerType from '../../interfaces/std/partner-type.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdPartnerType[] = [
  {
		"partner_type_id" : 1,
		"partner_type_cd" : "001",
		"partner_type_nm" : "고객",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e3531aab-d3bf-4693-bb4f-f7ba076f83de"
	},
	{
		"partner_type_id" : 2,
		"partner_type_cd" : "002",
		"partner_type_nm" : "구매",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "89498586-040c-4fe6-b32a-81b8720d73fe"
	},
	{
		"partner_type_id" : 3,
		"partner_type_cd" : "003",
		"partner_type_nm" : "매입",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2f93344c-db42-44ae-b369-9c23cc5bf753"
	},
	{
		"partner_type_id" : 4,
		"partner_type_cd" : "004",
		"partner_type_nm" : "부품구매",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "72a9ffae-5678-4260-af67-2a010b8c59c8"
	},
	{
		"partner_type_id" : 5,
		"partner_type_cd" : "005",
		"partner_type_nm" : "판매",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b620c8ed-c412-4790-81ed-ed00dea9662c"
	},
	{
		"partner_type_id" : 7,
		"partner_type_cd" : "006",
		"partner_type_nm" : "외주처",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "26a47da2-5f1e-4372-9870-c6a0c8d1904d"
	}
]

const baseMigration = new BaseMigration('StdPartnerType', 'partner_type_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };