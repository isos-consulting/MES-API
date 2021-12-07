import moment = require('moment');
import IMatOrder from '../../interfaces/mat/order.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IMatOrder[] = [
  {
		"order_id" : 1,
		"factory_id" : 1,
		"partner_id" : 5,
		"stmt_no" : "202110060001",
		"reg_date" : moment("2021-10-05T15:00:00.000Z").toDate(),
		"total_price" : 899730.000000,
		"total_qty" : 170.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "affdb62e-cb7c-4e02-a5be-519985d4e614"
	},
	{
		"order_id" : 2,
		"factory_id" : 1,
		"partner_id" : 5,
		"stmt_no" : "202110060002",
		"reg_date" : moment("2021-10-05T15:00:00.000Z").toDate(),
		"total_price" : 716780.000000,
		"total_qty" : 100.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b8a4260b-2e34-42a1-bc07-e35b35c86db4"
	},
	{
		"order_id" : 3,
		"factory_id" : 1,
		"partner_id" : 5,
		"stmt_no" : "202111060001",
		"reg_date" : moment("2021-11-05T15:00:00.000Z").toDate(),
		"total_price" : 464740.000000,
		"total_qty" : 60.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fa7866d3-14d1-4528-82f4-aba738f19213"
	},
	{
		"order_id" : 4,
		"factory_id" : 1,
		"partner_id" : 5,
		"stmt_no" : "202110060003",
		"reg_date" : moment("2021-10-05T15:00:00.000Z").toDate(),
		"total_price" : 159285.000000,
		"total_qty" : 20.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0bfba2cd-701f-4dc9-a946-d72d610d2edf"
	},
	{
		"order_id" : 5,
		"factory_id" : 1,
		"partner_id" : 5,
		"stmt_no" : "202111010001",
		"reg_date" : moment("2021-10-31T15:00:00.000Z").toDate(),
		"total_price" : 162370.000000,
		"total_qty" : 35.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "778d6f6b-b2b8-48ff-b104-9a8dfb4d5fee"
	},
	{
		"order_id" : 6,
		"factory_id" : 1,
		"partner_id" : 5,
		"stmt_no" : "202111060002",
		"reg_date" : moment("2021-11-05T15:00:00.000Z").toDate(),
		"total_price" : 787040.000000,
		"total_qty" : 180.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "95eea01c-346e-4d27-865c-ab4b74e8ab9e"
	},
	{
		"order_id" : 7,
		"factory_id" : 1,
		"partner_id" : 5,
		"stmt_no" : "202110060004",
		"reg_date" : moment("2021-10-05T15:00:00.000Z").toDate(),
		"total_price" : 538914.000000,
		"total_qty" : 122.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e9363ec6-154e-45c7-b8b9-801c6c9ddbd6"
	},
	{
		"order_id" : 8,
		"factory_id" : 1,
		"partner_id" : 5,
		"stmt_no" : "202112010001",
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toDate(),
		"total_price" : 288500.000000,
		"total_qty" : 70.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5c840edc-b050-40d4-b269-c3fad6b491ab"
	},
	{
		"order_id" : 9,
		"factory_id" : 1,
		"partner_id" : 5,
		"stmt_no" : "202112010002",
		"reg_date" : moment("2021-11-30T15:00:00.000Z").toDate(),
		"total_price" : 1317380.000000,
		"total_qty" : 210.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ae770b8e-4875-493a-be8d-762221ea72f3"
	},
	{
		"order_id" : 10,
		"factory_id" : 1,
		"partner_id" : 5,
		"stmt_no" : "202112020001",
		"reg_date" : moment("2021-12-01T15:00:00.000Z").toDate(),
		"total_price" : 76740.000000,
		"total_qty" : 25.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4475a6b6-0f1b-4aa3-bd6f-edbc58f324d4"
	},
	{
		"order_id" : 17,
		"factory_id" : 1,
		"partner_id" : 4,
		"stmt_no" : "202110060005",
		"reg_date" : moment("2021-10-05T15:00:00.000Z").toDate(),
		"total_price" : 42000.000000,
		"total_qty" : 20.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "37866194-4d46-442e-bc37-923a713790e8"
	},
	{
		"order_id" : 18,
		"factory_id" : 1,
		"partner_id" : 2,
		"stmt_no" : "202110070001",
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"total_price" : 348500.000000,
		"total_qty" : 200.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "507a5265-c05d-4126-9ef8-8b3b3afdc495"
	}
]

const baseMigration = new BaseMigration('MatOrder', 'order_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };