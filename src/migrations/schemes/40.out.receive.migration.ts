import moment = require('moment');
import IOutReceive from '../../interfaces/out/receive.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IOutReceive[] = [
  {
		"receive_id" : 1,
		"factory_id" : 1,
		"partner_id" : 2,
		"supplier_id" : null,
		"stmt_no" : "202110070001",
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"total_price" : 149750.000000,
		"total_qty" : 20.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7b482a31-9330-4cb1-8be4-fdd8a62eecf3"
	},
	{
		"receive_id" : 2,
		"factory_id" : 1,
		"partner_id" : 2,
		"supplier_id" : null,
		"stmt_no" : "202110070002",
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"total_price" : 120150.000000,
		"total_qty" : 30.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1da94f66-f3f2-4623-bb04-5ac3ec1e96f8"
	},
	{
		"receive_id" : 3,
		"factory_id" : 1,
		"partner_id" : 2,
		"supplier_id" : null,
		"stmt_no" : "202110080001",
		"reg_date" : moment("2021-10-07T15:00:00.000Z").toDate(),
		"total_price" : 868500.000000,
		"total_qty" : 200.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "12530cac-891e-4b8a-9ae3-e57f8a803a3c"
	},
	{
		"receive_id" : 4,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202110070003",
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"total_price" : 463500.000000,
		"total_qty" : 32.200000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9d24ef3e-004d-4614-8cc5-fd9f83e4ecf6"
	},
	{
		"receive_id" : 5,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202111010001",
		"reg_date" : moment("2021-10-31T15:00:00.000Z").toDate(),
		"total_price" : 363000.000000,
		"total_qty" : 30.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6383fc50-1037-45c7-bb21-a52e62bcfb1b"
	},
	{
		"receive_id" : 6,
		"factory_id" : 1,
		"partner_id" : 4,
		"supplier_id" : null,
		"stmt_no" : "202111010002",
		"reg_date" : moment("2021-10-31T15:00:00.000Z").toDate(),
		"total_price" : 553350.000000,
		"total_qty" : 200.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "24711351-b69a-41a8-8f2a-ab6f4796684d"
	},
	{
		"receive_id" : 7,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202111020001",
		"reg_date" : moment("2021-11-01T15:00:00.000Z").toDate(),
		"total_price" : 1514227.000000,
		"total_qty" : 111.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a36554bf-58ed-4b84-bc53-5e243f6af36e"
	},
	{
		"receive_id" : 8,
		"factory_id" : 1,
		"partner_id" : 5,
		"supplier_id" : null,
		"stmt_no" : "202110070004",
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"total_price" : 1829500.000000,
		"total_qty" : 50.000000,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9dd34ebd-ce27-4543-8b4f-fa5337e8e20d"
	}
];

const baseMigration = new BaseMigration('OutReceive', 'receive_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };