import moment = require('moment');
import ISalIncome from '../../interfaces/sal/income.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: ISalIncome[] = [
  {
		"income_id" : 1,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-03T15:00:00.000Z").toString(),
		"prod_id" : 6,
		"lot_no" : "SILSA001",
		"qty" : 150.000000,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c443fa54-cee2-4463-a597-807daefc2cf8"
	},
	{
		"income_id" : 2,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-03T15:00:00.000Z").toString(),
		"prod_id" : 6,
		"lot_no" : "SILSA002",
		"qty" : 150.000000,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "24be13df-9757-45dc-8e38-224f3b61d040"
	},
	{
		"income_id" : 3,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-03T15:00:00.000Z").toString(),
		"prod_id" : 8,
		"lot_no" : "SILSA001",
		"qty" : 150.000000,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2bdf68c8-e7f7-4b74-99a5-f6492535970d"
	},
	{
		"income_id" : 4,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toString(),
		"prod_id" : 6,
		"lot_no" : "SILSA001",
		"qty" : 150.000000,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4d13543b-f1a7-4f11-8242-6ed0369ec545"
	},
	{
		"income_id" : 5,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toString(),
		"prod_id" : 6,
		"lot_no" : "SILSA001",
		"qty" : 150.000000,
		"from_store_id" : 3,
		"from_location_id" : 3,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5ca5a7f3-0ad7-45f9-a2e6-8c897a0cb7a2"
	},
	{
		"income_id" : 6,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toString(),
		"prod_id" : 6,
		"lot_no" : "SILSA002",
		"qty" : 150.000000,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "df0b340d-2fee-437a-83fc-2718703a236d"
	},
	{
		"income_id" : 7,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toString(),
		"prod_id" : 6,
		"lot_no" : "SILSA002",
		"qty" : 150.000000,
		"from_store_id" : 3,
		"from_location_id" : 3,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "259fa35b-939e-436e-8f76-6dd4e00268a9"
	},
	{
		"income_id" : 8,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toString(),
		"prod_id" : 7,
		"lot_no" : "20211007",
		"qty" : 150.000000,
		"from_store_id" : 1,
		"from_location_id" : null,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0ea307f5-3044-41cc-aa80-e7725ba657c9"
	},
	{
		"income_id" : 9,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toString(),
		"prod_id" : 7,
		"lot_no" : "SILSA001",
		"qty" : 150.000000,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5b573880-dd63-4db6-9492-74ea2886475e"
	},
	{
		"income_id" : 10,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-16T15:00:00.000Z").toString(),
		"prod_id" : 27,
		"lot_no" : "OUT002-1",
		"qty" : 100.000000,
		"from_store_id" : 1,
		"from_location_id" : 1,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "43745b76-f94f-4c6b-b71a-c1ba8d70cc45"
	},
	{
		"income_id" : 11,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-16T15:00:00.000Z").toString(),
		"prod_id" : 27,
		"lot_no" : "OUT002",
		"qty" : 100.000000,
		"from_store_id" : 1,
		"from_location_id" : 1,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c104e251-f8ff-48d2-afa9-e40fdfc6cbc7"
	},
	{
		"income_id" : 12,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-16T15:00:00.000Z").toString(),
		"prod_id" : 27,
		"lot_no" : "OUT001",
		"qty" : 450.000000,
		"from_store_id" : 1,
		"from_location_id" : 1,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "177d1bcb-32d1-4d8b-84f2-f745b656695c"
	},
	{
		"income_id" : 13,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-16T15:00:00.000Z").toString(),
		"prod_id" : 27,
		"lot_no" : "20211007",
		"qty" : 10.000000,
		"from_store_id" : 1,
		"from_location_id" : 1,
		"to_store_id" : 3,
		"to_location_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "049f31ae-ac34-4dd7-b72c-651358898c61"
	}
];

const baseMigration = new BaseMigration('SalIncome', 'income_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };