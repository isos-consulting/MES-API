import moment = require('moment');
import ISalReturn from '../../interfaces/sal/return.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: ISalReturn[] = [
  {
		"return_id" : 1,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202110010001",
		"reg_date" : moment("2021-09-30T15:00:00.000Z").toDate(),
		"total_price" : 9000.000000,
		"total_qty" : 30.000000,
		"outgo_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c2adb711-1b19-4017-957e-aa6fc865964f"
	},
	{
		"return_id" : 2,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202110010002",
		"reg_date" : moment("2021-09-30T15:00:00.000Z").toDate(),
		"total_price" : 10000.000000,
		"total_qty" : 30.000000,
		"outgo_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fa9e9ba2-823e-4351-9571-838d558386d2"
	},
	{
		"return_id" : 3,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202110010003",
		"reg_date" : moment("2021-09-30T15:00:00.000Z").toDate(),
		"total_price" : 14000.000000,
		"total_qty" : 30.000000,
		"outgo_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8b0f8f7a-a0ab-44d9-9eb8-78fca2a1c4a6"
	},
	{
		"return_id" : 4,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202111030001",
		"reg_date" : moment("2021-11-02T15:00:00.000Z").toDate(),
		"total_price" : 3000.000000,
		"total_qty" : 30.000000,
		"outgo_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8954237e-6451-4fe8-a872-c94156531c04"
	},
	{
		"return_id" : 5,
		"factory_id" : 1,
		"partner_id" : 3,
		"delivery_id" : null,
		"stmt_no" : "202111030002",
		"reg_date" : moment("2021-11-02T15:00:00.000Z").toDate(),
		"total_price" : 70000.000000,
		"total_qty" : 30.000000,
		"outgo_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "70f1317b-c627-4dd0-af2b-8bfd13f7fb31"
	},
	{
		"return_id" : 6,
		"factory_id" : 1,
		"partner_id" : 3,
		"delivery_id" : null,
		"stmt_no" : "202111030003",
		"reg_date" : moment("2021-11-02T15:00:00.000Z").toDate(),
		"total_price" : 90000.000000,
		"total_qty" : 40.000000,
		"outgo_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "be0f1dfd-17ff-4bf9-9999-f823b0a3ecd2"
	},
	{
		"return_id" : 7,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202112030001",
		"reg_date" : moment("2021-12-02T15:00:00.000Z").toDate(),
		"total_price" : 37000.000000,
		"total_qty" : 60.000000,
		"outgo_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2c0e960d-3315-490f-b756-4ec8c8528b07"
	},
	{
		"return_id" : 8,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202112030002",
		"reg_date" : moment("2021-12-02T15:00:00.000Z").toDate(),
		"total_price" : 10000.000000,
		"total_qty" : 60.000000,
		"outgo_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f6eef040-b130-40b1-801b-d2ac237c6ac6"
	},
	{
		"return_id" : 9,
		"factory_id" : 1,
		"partner_id" : 3,
		"delivery_id" : null,
		"stmt_no" : "202112030003",
		"reg_date" : moment("2021-12-02T15:00:00.000Z").toDate(),
		"total_price" : 180000.000000,
		"total_qty" : 60.000000,
		"outgo_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3e3e0c3d-fd81-4748-a663-fd9dad421842"
	},
	{
		"return_id" : 10,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202112030005",
		"reg_date" : moment("2021-12-02T15:00:00.000Z").toDate(),
		"total_price" : 1000.000000,
		"total_qty" : 5.000000,
		"outgo_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d662b721-17b9-4742-8420-d75d2a157a43"
	}
];

const baseMigration = new BaseMigration('SalReturn', 'return_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };