import IStdItemType from '../../interfaces/std/item-type.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdItemType[] = [
  {
		"item_type_id" : 1,
		"item_type_cd" : "001",
		"item_type_nm" : "완제품",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d61345ae-312a-41df-95de-9fb17c8d56ea"
	},
	{
		"item_type_id" : 2,
		"item_type_cd" : "002",
		"item_type_nm" : "반제품",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4bad5380-ee2d-4114-a3c8-f2f640210cbc"
	},
	{
		"item_type_id" : 3,
		"item_type_cd" : "003",
		"item_type_nm" : "자재",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3caabb82-d36d-4b50-a5b7-df57405aa798"
	},
	{
		"item_type_id" : 6,
		"item_type_cd" : "004",
		"item_type_nm" : "외주품",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2853c37d-4379-4c83-aaad-0f217b3642f0"
	}
]

const baseMigration = new BaseMigration('StdItemType', 'item_type_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };