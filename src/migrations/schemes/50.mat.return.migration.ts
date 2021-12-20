import moment = require('moment');
import IMatReturn from '../../interfaces/mat/return.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IMatReturn[] = [
  {
		"return_id" : 1,
		"factory_id" : 1,
		"partner_id" : 3,
		"supplier_id" : null,
		"stmt_no" : "202110250003",
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toDate(),
		"total_price" : 159950.000000,
		"total_qty" : 84.000000,
		"receive_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c332c1df-0b8b-4d31-b73e-f1eb3ef98863"
	},
	{
		"return_id" : 2,
		"factory_id" : 1,
		"partner_id" : 1,
		"supplier_id" : null,
		"stmt_no" : "202110250004",
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toDate(),
		"total_price" : 265000.000000,
		"total_qty" : 600.000000,
		"receive_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "12141b5c-bbb5-4d6c-86a8-295dfc8640c4"
	},
	{
		"return_id" : 3,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202110250005",
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toDate(),
		"total_price" : 1658103.000000,
		"total_qty" : 180.000000,
		"receive_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "97fa682e-9e7a-4195-a997-ade65fa1ecf5"
	},
	{
		"return_id" : 4,
		"factory_id" : 1,
		"partner_id" : 3,
		"supplier_id" : null,
		"stmt_no" : "202111250004",
		"reg_date" : moment("2021-11-24T15:00:00.000Z").toDate(),
		"total_price" : 460000.000000,
		"total_qty" : 180.000000,
		"receive_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a7f98b94-af5b-4ab8-9829-8e9efd88a2a2"
	},
	{
		"return_id" : 5,
		"factory_id" : 1,
		"partner_id" : 3,
		"supplier_id" : null,
		"stmt_no" : "202111250005",
		"reg_date" : moment("2021-11-24T15:00:00.000Z").toDate(),
		"total_price" : 5080000.000000,
		"total_qty" : 360.000000,
		"receive_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f545db24-d15d-4571-ae49-ff64190958b2"
	},
	{
		"return_id" : 6,
		"factory_id" : 1,
		"partner_id" : 4,
		"supplier_id" : null,
		"stmt_no" : "202111250006",
		"reg_date" : moment("2021-11-24T15:00:00.000Z").toDate(),
		"total_price" : 354146.000000,
		"total_qty" : 209.000000,
		"receive_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ac49d716-4294-4986-b1de-e3b65b3f7c8e"
	},
	{
		"return_id" : 7,
		"factory_id" : 1,
		"partner_id" : 2,
		"supplier_id" : null,
		"stmt_no" : "202112250004",
		"reg_date" : moment("2021-12-24T15:00:00.000Z").toDate(),
		"total_price" : 1820150.000000,
		"total_qty" : 919.000000,
		"receive_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a652c5e5-7cab-4062-bf10-941a267bbaac"
	},
	{
		"return_id" : 8,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202112250005",
		"reg_date" : moment("2021-12-24T15:00:00.000Z").toDate(),
		"total_price" : 1542800.000000,
		"total_qty" : 399.000000,
		"receive_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7118823a-e3ea-4314-9b4d-60465fd903a5"
	},
	{
		"return_id" : 9,
		"factory_id" : 1,
		"partner_id" : 3,
		"supplier_id" : null,
		"stmt_no" : "202112250006",
		"reg_date" : moment("2021-12-24T15:00:00.000Z").toDate(),
		"total_price" : -510800.000000,
		"total_qty" : -71.000000,
		"receive_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "833f9a5a-12ca-4b71-8e12-dc027f407052"
	}
]

const baseMigration = new BaseMigration('MatReturn', 'return_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };