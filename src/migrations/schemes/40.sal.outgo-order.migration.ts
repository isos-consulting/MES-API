import moment = require('moment');
import ISalOutgoOrder from '../../interfaces/sal/outgo-order.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: ISalOutgoOrder[] = [
  {
		"outgo_order_id" : 1,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toString(),
		"total_qty" : 90.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cc2f4c74-375c-4506-8ffd-f96038b57b6d"
	},
	{
		"outgo_order_id" : 2,
		"factory_id" : 1,
		"partner_id" : 3,
		"delivery_id" : null,
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toString(),
		"total_qty" : 210.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "594c2406-95d6-493a-a06a-140973af7a61"
	},
	{
		"outgo_order_id" : 3,
		"factory_id" : 1,
		"partner_id" : 3,
		"delivery_id" : null,
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toString(),
		"total_qty" : 240.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d19b6135-1457-44b6-a5d8-c5f60a318d7b"
	},
	{
		"outgo_order_id" : 4,
		"factory_id" : 1,
		"partner_id" : 3,
		"delivery_id" : null,
		"reg_date" : moment("2021-10-11T15:00:00.000Z").toString(),
		"total_qty" : 800.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4f3aee2d-716f-4c6f-8091-afcbc425f7b1"
	},
	{
		"outgo_order_id" : 5,
		"factory_id" : 1,
		"partner_id" : 3,
		"delivery_id" : null,
		"reg_date" : moment("2021-10-14T15:00:00.000Z").toString(),
		"total_qty" : 1050.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "db6212e6-ae85-4e58-8c02-e1afb7b260e0"
	},
	{
		"outgo_order_id" : 6,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"reg_date" : moment("2021-10-14T15:00:00.000Z").toString(),
		"total_qty" : 1806.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "36dc359e-2a8d-41ef-88fb-a2b4bd2278be"
	},
	{
		"outgo_order_id" : 7,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"total_qty" : 40.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "de6ba713-1eb5-4f6b-8c87-d4f37b7feb7b"
	},
	{
		"outgo_order_id" : 8,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"total_qty" : 210.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1ab7122a-9b61-4c87-8580-05ec63308fac"
	},
	{
		"outgo_order_id" : 9,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"total_qty" : 75.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "82e720bf-c5fc-44da-b754-b412351e73a5"
	},
	{
		"outgo_order_id" : 10,
		"factory_id" : 1,
		"partner_id" : 1,
		"delivery_id" : null,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"total_qty" : 75.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f7bb840a-ca25-4412-89ad-e8d9ded04398"
	}
];

const baseMigration = new BaseMigration('SalOutgoOrder', 'outgo_order_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };