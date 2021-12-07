import moment = require('moment');
import IOutRelease from '../../interfaces/out/release.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IOutRelease[] = [
  {
		"release_id" : 1,
		"factory_id" : 1,
		"partner_id" : 2,
		"delivery_id" : null,
		"stmt_no" : "202110070001",
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"total_price" : 50000.000000,
		"total_qty" : 200.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "447de0d0-fbe6-4b4c-a4b9-0713e21f5d9d"
	},
	{
		"release_id" : 2,
		"factory_id" : 1,
		"partner_id" : 2,
		"delivery_id" : null,
		"stmt_no" : "202110070002",
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"total_price" : 43440.000000,
		"total_qty" : 80.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bd75cfcf-fd58-4f74-952e-f43740454bb4"
	},
	{
		"release_id" : 3,
		"factory_id" : 1,
		"partner_id" : 2,
		"delivery_id" : null,
		"stmt_no" : "202110080001",
		"reg_date" : moment("2021-10-07T15:00:00.000Z").toDate(),
		"total_price" : 136160.000000,
		"total_qty" : 140.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4078db3b-f64b-4179-9e2a-723bf5beb33c"
	},
	{
		"release_id" : 4,
		"factory_id" : 1,
		"partner_id" : 2,
		"delivery_id" : null,
		"stmt_no" : "202111010001",
		"reg_date" : moment("2021-10-31T15:00:00.000Z").toDate(),
		"total_price" : 6500.000000,
		"total_qty" : 30.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "40ae4527-aefd-48bb-8ce2-2221fd4ec026"
	},
	{
		"release_id" : 5,
		"factory_id" : 1,
		"partner_id" : 2,
		"delivery_id" : null,
		"stmt_no" : "202111010002",
		"reg_date" : moment("2021-10-31T15:00:00.000Z").toDate(),
		"total_price" : 6500.000000,
		"total_qty" : 30.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "568cd215-4623-4dc6-9e9f-58c489b84451"
	},
	{
		"release_id" : 6,
		"factory_id" : 1,
		"partner_id" : 2,
		"delivery_id" : null,
		"stmt_no" : "202111020001",
		"reg_date" : moment("2021-11-01T15:00:00.000Z").toDate(),
		"total_price" : 6500.000000,
		"total_qty" : 30.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "54899df0-f0b8-4a95-9065-d81d1e8f41d7"
	},
	{
		"release_id" : 7,
		"factory_id" : 1,
		"partner_id" : 2,
		"delivery_id" : null,
		"stmt_no" : "202112070001",
		"reg_date" : moment("2021-12-06T15:00:00.000Z").toDate(),
		"total_price" : 252000.000000,
		"total_qty" : 1040.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a80b90e9-2f7a-4825-a27a-4bd825f5115f"
	},
	{
		"release_id" : 8,
		"factory_id" : 1,
		"partner_id" : 2,
		"delivery_id" : null,
		"stmt_no" : "202112070002",
		"reg_date" : moment("2021-12-06T15:00:00.000Z").toDate(),
		"total_price" : 6500.000000,
		"total_qty" : 30.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e9771408-ed7e-4527-b647-b5ea2294cb4f"
	},
	{
		"release_id" : 9,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202112080001",
		"reg_date" : moment("2021-12-07T15:00:00.000Z").toDate(),
		"total_price" : 20000.000000,
		"total_qty" : 100.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "89b1e6cc-b1d3-498e-bd90-6d69122cbff2"
	},
	{
		"release_id" : 10,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202112090001",
		"reg_date" : moment("2021-12-08T15:00:00.000Z").toDate(),
		"total_price" : 118000.000000,
		"total_qty" : 40.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "26009d5c-a74f-4b66-86b8-c07956b71b27"
	}
];

const baseMigration = new BaseMigration('OutRelease', 'release_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };