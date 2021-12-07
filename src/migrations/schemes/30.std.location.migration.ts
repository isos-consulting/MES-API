import IStdLocation from '../../interfaces/std/location.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdLocation[] = [
  {
		"location_id" : 1,
		"factory_id" : 1,
		"store_id" : 1,
		"location_cd" : "001",
		"location_nm" : "A구역",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9f0aa080-c8ee-4531-b30f-33e985292fdc"
	},
	{
		"location_id" : 2,
		"factory_id" : 1,
		"store_id" : 2,
		"location_cd" : "002",
		"location_nm" : "B구역",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "849d3120-bb24-4002-83f1-c4ece2d980f0"
	},
	{
		"location_id" : 3,
		"factory_id" : 1,
		"store_id" : 3,
		"location_cd" : "003",
		"location_nm" : "B구역",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "132e7bb5-cd9b-4690-9c8a-9ba75057a847"
	},
	{
		"location_id" : 4,
		"factory_id" : 1,
		"store_id" : 4,
		"location_cd" : "004",
		"location_nm" : "C구역",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f22b71de-25d1-4712-92aa-cf517d3251a5"
	},
	{
		"location_id" : 6,
		"factory_id" : 1,
		"store_id" : 5,
		"location_cd" : "005",
		"location_nm" : "A1-ERROR",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "22a771e2-52cb-4276-850d-73b02c619151"
	}
]

const baseMigration = new BaseMigration('StdLocation', 'location_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };