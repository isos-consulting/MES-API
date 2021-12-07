import IStdMoneyUnit from '../../interfaces/std/money-unit.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdMoneyUnit[] = [
  {
		"money_unit_id" : 1,
		"money_unit_cd" : "001",
		"money_unit_nm" : "\\",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "951070e8-372d-4abb-b574-de93075efb53"
	},
	{
		"money_unit_id" : 2,
		"money_unit_cd" : "002",
		"money_unit_nm" : "$",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6dcb331c-9f92-4200-a1c1-200c1f884a30"
	},
	{
		"money_unit_id" : 3,
		"money_unit_cd" : "003",
		"money_unit_nm" : "¥",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "baad0247-43c0-4082-a896-fe49eee10efb"
	}
]

const baseMigration = new BaseMigration('StdMoneyUnit', 'money_unit_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };