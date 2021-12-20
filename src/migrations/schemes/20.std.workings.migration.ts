import IStdWorkings from '../../interfaces/std/workings.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IStdWorkings[] = [
  {
		"workings_id" : 1,
		"factory_id" : 1,
		"workings_cd" : "001",
		"workings_nm" : "쇼트라인1",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "27a91b25-3ac9-495e-8123-b0163711f778"
	},
	{
		"workings_id" : 2,
		"factory_id" : 1,
		"workings_cd" : "002",
		"workings_nm" : "쇼트라인2",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2b13692f-dbd1-4033-bcd0-642918430943"
	},
	{
		"workings_id" : 3,
		"factory_id" : 1,
		"workings_cd" : "003",
		"workings_nm" : "수동조립1",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6767cfe6-ee90-4cab-ad36-51e46d9d0da9"
	},
	{
		"workings_id" : 4,
		"factory_id" : 1,
		"workings_cd" : "004",
		"workings_nm" : "수동조립2",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8a2d3fbd-0b26-4cbb-a3eb-237e8b0276b1"
	},
	{
		"workings_id" : 5,
		"factory_id" : 1,
		"workings_cd" : "005",
		"workings_nm" : "수동조립3",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "87eb6d6f-fefc-4443-bc7c-7a685f802716"
	}
]

const baseMigration = new BaseMigration('StdWorkings', 'workings_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };