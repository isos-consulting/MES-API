import moment = require('moment');
import IMatReceive from '../../interfaces/mat/receive.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IMatReceive[] = [
  {
		"receive_id" : 1,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202110070001",
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toString(),
		"total_price" : 801160.000000,
		"total_qty" : 50.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c56b4359-e79a-4c2a-9437-57d72e08409c"
	},
	{
		"receive_id" : 2,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202110070002",
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toString(),
		"total_price" : 190040.000000,
		"total_qty" : 10.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6976a931-704d-41f3-a988-d3453d54b1ec"
	},
	{
		"receive_id" : 3,
		"factory_id" : 1,
		"partner_id" : 4,
		"supplier_id" : 5,
		"stmt_no" : "202110070003",
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toString(),
		"total_price" : 85820.000000,
		"total_qty" : 30.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "134f4fd9-d4dd-4bbd-b0eb-a2703eeacbd4"
	},
	{
		"receive_id" : 4,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202111070002",
		"reg_date" : moment("2021-11-06T15:00:00.000Z").toString(),
		"total_price" : 816950.000000,
		"total_qty" : 4.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9a9dfc75-059f-408c-93ed-39db7adfa70d"
	},
	{
		"receive_id" : 5,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : 1,
		"stmt_no" : "202111080001",
		"reg_date" : moment("2021-11-07T15:00:00.000Z").toString(),
		"total_price" : 838795.000000,
		"total_qty" : 10.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "26ec917b-239a-49ed-b338-95a7c77b7c42"
	},
	{
		"receive_id" : 6,
		"factory_id" : 1,
		"partner_id" : 4,
		"supplier_id" : null,
		"stmt_no" : "202111070003",
		"reg_date" : moment("2021-11-06T15:00:00.000Z").toString(),
		"total_price" : 64000.000000,
		"total_qty" : 20.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "46c112ef-ea82-4a78-bc3a-bbf5586ccaa8"
	},
	{
		"receive_id" : 7,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202112070001",
		"reg_date" : moment("2021-12-06T15:00:00.000Z").toString(),
		"total_price" : 1591540.000000,
		"total_qty" : 40.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "68f75b32-2a05-4105-a25c-28c36d39b219"
	},
	{
		"receive_id" : 8,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202112080001",
		"reg_date" : moment("2021-12-07T15:00:00.000Z").toString(),
		"total_price" : 101574.000000,
		"total_qty" : 81.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "18223f3a-a8bd-4035-a1e9-ecb8e544a685"
	},
	{
		"receive_id" : 9,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202112070002",
		"reg_date" : moment("2021-12-06T15:00:00.000Z").toString(),
		"total_price" : 33540.000000,
		"total_qty" : 10.000000,
		"order_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "913d6b2c-89fa-473b-8616-e75e124eff9a"
	}
]

const baseMigration = new BaseMigration('MatReceive', 'receive_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };