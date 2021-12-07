import moment = require('moment');
import ISalOutgo from '../../interfaces/sal/outgo.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: ISalOutgo[] = [
  {
		"outgo_id" : 1,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202110010001",
		"reg_date" : moment("2021-09-30T15:00:00.000Z").toDate(),
		"total_price" : 55000.000000,
		"total_qty" : 10.000000,
		"order_id" : null,
		"outgo_order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "249b0959-a6d9-4c4d-a246-c2299550a33d"
	},
	{
		"outgo_id" : 2,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202110250001",
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toDate(),
		"total_price" : 67000.000000,
		"total_qty" : 10.000000,
		"order_id" : null,
		"outgo_order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a2722b2a-47bc-46e5-a6b5-b6d9f5ecd3ce"
	},
	{
		"outgo_id" : 3,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202110250002",
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toDate(),
		"total_price" : 13250.000000,
		"total_qty" : 10.000000,
		"order_id" : null,
		"outgo_order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "945e4750-2cc8-42b3-a7bb-737f946f7321"
	},
	{
		"outgo_id" : 4,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202111250001",
		"reg_date" : moment("2021-11-24T15:00:00.000Z").toDate(),
		"total_price" : 7750.000000,
		"total_qty" : 10.000000,
		"order_id" : null,
		"outgo_order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "716ea4ba-c429-4b4f-acb8-db9fed90d16e"
	},
	{
		"outgo_id" : 5,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202111250002",
		"reg_date" : moment("2021-11-24T15:00:00.000Z").toDate(),
		"total_price" : 14000.000000,
		"total_qty" : 10.000000,
		"order_id" : null,
		"outgo_order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e3915da1-5f2f-4b4b-a636-7a5ac7a4e300"
	},
	{
		"outgo_id" : 6,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202111250003",
		"reg_date" : moment("2021-11-24T15:00:00.000Z").toDate(),
		"total_price" : 1110.000000,
		"total_qty" : 3.000000,
		"order_id" : null,
		"outgo_order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fabb5502-a903-49b3-9278-d163877921aa"
	},
	{
		"outgo_id" : 7,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202112250001",
		"reg_date" : moment("2021-12-24T15:00:00.000Z").toDate(),
		"total_price" : 14000.000000,
		"total_qty" : 10.000000,
		"order_id" : null,
		"outgo_order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4047a0d1-2fcf-43fe-aa1b-d0b41760edb0"
	},
	{
		"outgo_id" : 8,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202112250002",
		"reg_date" : moment("2021-12-24T15:00:00.000Z").toDate(),
		"total_price" : 3600.000000,
		"total_qty" : 10.000000,
		"order_id" : null,
		"outgo_order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "20f6d1e1-a263-4be4-90db-f5e054c16819"
	},
	{
		"outgo_id" : 9,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"stmt_no" : "202112250003",
		"reg_date" : moment("2021-12-24T15:00:00.000Z").toDate(),
		"total_price" : 7000.000000,
		"total_qty" : 30.000000,
		"order_id" : null,
		"outgo_order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "093f650c-0740-4c06-8487-b6e2ea1e1390"
	}
];

const baseMigration = new BaseMigration('SalOutgo', 'outgo_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };