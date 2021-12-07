import IStdProdType from '../../interfaces/std/prod-type.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdProdType[] = [
  {
		"prod_type_id" : 1,
		"prod_type_cd" : "001",
		"prod_type_nm" : "MCW",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c649a9d1-84a7-4601-bfd7-4d9fff2cc73f"
	},
	{
		"prod_type_id" : 2,
		"prod_type_cd" : "002",
		"prod_type_nm" : "C\/HSG",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b3b2f0bf-1bc6-4e0c-bef3-15b0fd9ada12"
	},
	{
		"prod_type_id" : 3,
		"prod_type_cd" : "003",
		"prod_type_nm" : "PIPE",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9d792b1b-3bef-4482-a727-75f1e7980e15"
	},
	{
		"prod_type_id" : 5,
		"prod_type_cd" : "004",
		"prod_type_nm" : "SHAFT",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "19282fa3-c472-4233-8764-9b2d4e0f4817"
	},
	{
		"prod_type_id" : 6,
		"prod_type_cd" : "005",
		"prod_type_nm" : "TW",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "65febc10-ac57-44ac-af83-e866dd78a4ad"
	}
]

const baseMigration = new BaseMigration('StdProdType', 'prod_type_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };