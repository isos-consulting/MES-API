import moment = require('moment');
import ISalOrder from '../../interfaces/sal/order.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: ISalOrder[] = [
  {
		"order_id" : 1,
		"factory_id" : 1,
		"partner_id" : 1,
		"stmt_no" : "202110170001",
		"reg_date" : moment("2021-10-16T15:00:00.000Z").toDate(),
		"total_price" : 9000.000000,
		"total_qty" : 30.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3492d6db-7f14-4ac5-a713-7fc8bdbd528a"
	},
	{
		"order_id" : 2,
		"factory_id" : 1,
		"partner_id" : 1,
		"stmt_no" : "202110170002",
		"reg_date" : moment("2021-10-16T15:00:00.000Z").toDate(),
		"total_price" : 33750.000000,
		"total_qty" : 200.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "472b69de-7c98-44ad-a9ef-cc281b8050ca"
	},
	{
		"order_id" : 5,
		"factory_id" : 1,
		"partner_id" : 1,
		"stmt_no" : "202110170003",
		"reg_date" : moment("2021-10-16T15:00:00.000Z").toDate(),
		"total_price" : 600.000000,
		"total_qty" : 60.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f21c6698-811a-4a58-abc3-f08ba5ba2f19"
	},
	{
		"order_id" : 6,
		"factory_id" : 1,
		"partner_id" : 1,
		"stmt_no" : "202111010001",
		"reg_date" : moment("2021-10-31T15:00:00.000Z").toDate(),
		"total_price" : 9150.000000,
		"total_qty" : 45.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3b391100-31d2-4b31-95b2-e93ede66ed8b"
	},
	{
		"order_id" : 7,
		"factory_id" : 1,
		"partner_id" : 1,
		"stmt_no" : "202111010002",
		"reg_date" : moment("2021-10-31T15:00:00.000Z").toDate(),
		"total_price" : 8560.000000,
		"total_qty" : 30.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f3bd9e95-da9b-4b99-b1e1-9e34c51bfffe"
	},
	{
		"order_id" : 8,
		"factory_id" : 1,
		"partner_id" : 1,
		"stmt_no" : "202111010003",
		"reg_date" : moment("2021-10-31T15:00:00.000Z").toDate(),
		"total_price" : 1650.000000,
		"total_qty" : 15.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8595e43c-d901-4854-8670-373394094555"
	},
	{
		"order_id" : 9,
		"factory_id" : 1,
		"partner_id" : 3,
		"stmt_no" : "202112010001",
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toDate(),
		"total_price" : 175000.000000,
		"total_qty" : 80.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "61a82895-24d4-4f11-81fe-1d416a1e8d12"
	},
	{
		"order_id" : 10,
		"factory_id" : 1,
		"partner_id" : 3,
		"stmt_no" : "202112010002",
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toDate(),
		"total_price" : 277500.000000,
		"total_qty" : 149.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1f1f63d5-1631-4d62-bdca-b4a0cf15e613"
	},
	{
		"order_id" : 11,
		"factory_id" : 1,
		"partner_id" : 1,
		"stmt_no" : "202112010003",
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toDate(),
		"total_price" : 5200.000000,
		"total_qty" : 60.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a86eed52-d16b-4648-8045-bd4d92996ea1"
	}
];

const baseMigration = new BaseMigration('SalOrder', 'order_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };