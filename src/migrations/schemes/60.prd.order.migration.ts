import moment = require('moment');
import IPrdOrder from '../../interfaces/prd/order.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IPrdOrder[] = [
  {
		"order_id" : 1,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"order_no" : "202110190001",
		"workings_id" : 3,
		"prod_id" : 1,
		"plan_qty" : 300.000000,
		"qty" : 100.000000,
		"seq" : null,
		"shift_id" : 2,
		"worker_group_id" : 1,
		"work_fg" : true,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "06e9f9f1-9ed8-43a6-8ffe-37daa2219fcb"
	},
	{
		"order_id" : 2,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"order_no" : "202110190002",
		"workings_id" : 4,
		"prod_id" : 1,
		"plan_qty" : 500.000000,
		"qty" : 150.000000,
		"seq" : null,
		"shift_id" : 1,
		"worker_group_id" : 1,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : true,
		"complete_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7f452542-3414-4ccb-9849-a4047de64fd5"
	},
	{
		"order_id" : 3,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"order_no" : "202110190003",
		"workings_id" : 5,
		"prod_id" : 1,
		"plan_qty" : 400.000000,
		"qty" : 500.000000,
		"seq" : null,
		"shift_id" : 1,
		"worker_group_id" : 2,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : true,
		"complete_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "90a5efd1-8b9b-4101-b0f9-470c7cbcc241"
	},
	{
		"order_id" : 4,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-18T15:00:00.000Z").toString(),
		"order_no" : "202111190001",
		"workings_id" : 3,
		"prod_id" : 5,
		"plan_qty" : 0.000000,
		"qty" : 150.000000,
		"seq" : null,
		"shift_id" : 2,
		"worker_group_id" : 2,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : true,
		"complete_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ddb190de-32b2-4389-b934-5c06edea03bc"
	},
	{
		"order_id" : 5,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-18T15:00:00.000Z").toString(),
		"order_no" : "202111190002",
		"workings_id" : 1,
		"prod_id" : 5,
		"plan_qty" : 0.000000,
		"qty" : 200.000000,
		"seq" : null,
		"shift_id" : 2,
		"worker_group_id" : 3,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c9878b68-4114-4474-a6d8-7207718a430a"
	},
	{
		"order_id" : 6,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-18T15:00:00.000Z").toString(),
		"order_no" : "202111190003",
		"workings_id" : 1,
		"prod_id" : 4,
		"plan_qty" : 0.000000,
		"qty" : 500.000000,
		"seq" : null,
		"shift_id" : 2,
		"worker_group_id" : 1,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c8bef36d-652c-4fed-8a9b-0254266caa72"
	},
	{
		"order_id" : 7,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-18T15:00:00.000Z").toString(),
		"order_no" : "202111190004",
		"workings_id" : 5,
		"prod_id" : 3,
		"plan_qty" : 0.000000,
		"qty" : -100.000000,
		"seq" : null,
		"shift_id" : 2,
		"worker_group_id" : 2,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7cc57ef6-fb73-4e48-ba2e-1356a1453772"
	},
	{
		"order_id" : 8,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-18T15:00:00.000Z").toString(),
		"order_no" : "202112190001",
		"workings_id" : 3,
		"prod_id" : 1,
		"plan_qty" : 0.000000,
		"qty" : 0.000000,
		"seq" : null,
		"shift_id" : 3,
		"worker_group_id" : 1,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "735e51de-3459-485a-800b-f2fc0d1bcf2c"
	},
	{
		"order_id" : 9,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-18T15:00:00.000Z").toString(),
		"order_no" : "202112190002",
		"workings_id" : 5,
		"prod_id" : 1,
		"plan_qty" : 0.000000,
		"qty" : 0.000000,
		"seq" : null,
		"shift_id" : 2,
		"worker_group_id" : 2,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5043ec6e-51fa-4628-b0e9-e2bb9f63fb92"
	},
	{
		"order_id" : 10,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-18T15:00:00.000Z").toString(),
		"order_no" : "202112190003",
		"workings_id" : 4,
		"prod_id" : 3,
		"plan_qty" : 0.000000,
		"qty" : 0.000000,
		"seq" : null,
		"shift_id" : 2,
		"worker_group_id" : 1,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3fbd8ebd-d51b-4c8f-89ed-988b1432d984"
	},
	{
		"order_id" : 11,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-18T15:00:00.000Z").toString(),
		"order_no" : "202112190004",
		"workings_id" : 2,
		"prod_id" : 6,
		"plan_qty" : 0.000000,
		"qty" : 0.000000,
		"seq" : null,
		"shift_id" : 3,
		"worker_group_id" : 2,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "311ded5d-f967-47d3-bec8-197f29c4bc34"
	},
	{
		"order_id" : 12,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-18T15:00:00.000Z").toString(),
		"order_no" : "202112190005",
		"workings_id" : 2,
		"prod_id" : 8,
		"plan_qty" : 0.000000,
		"qty" : 0.000000,
		"seq" : null,
		"shift_id" : 2,
		"worker_group_id" : 1,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ac9340d3-8c0a-4ff2-8f49-e11a515c8140"
	},
	{
		"order_id" : 13,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-18T15:00:00.000Z").toString(),
		"order_no" : "202112190006",
		"workings_id" : 1,
		"prod_id" : 8,
		"plan_qty" : 0.000000,
		"qty" : 0.000000,
		"seq" : null,
		"shift_id" : 3,
		"worker_group_id" : 3,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2325fee8-6fcf-4870-8c94-edcb93092144"
	},
	{
		"order_id" : 14,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-18T15:00:00.000Z").toString(),
		"order_no" : "202112190007",
		"workings_id" : 3,
		"prod_id" : 1,
		"plan_qty" : 0.000000,
		"qty" : 0.000000,
		"seq" : null,
		"shift_id" : 1,
		"worker_group_id" : 2,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b3c382e1-629b-48c4-8478-df9cffc63848"
	},
	{
		"order_id" : 15,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-18T15:00:00.000Z").toString(),
		"order_no" : "202112190008",
		"workings_id" : 5,
		"prod_id" : 1,
		"plan_qty" : 0.000000,
		"qty" : 0.000000,
		"seq" : null,
		"shift_id" : 1,
		"worker_group_id" : 3,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1828baba-9016-4d15-81e5-1a1f02698a9f"
	},
	{
		"order_id" : 16,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-18T15:00:00.000Z").toString(),
		"order_no" : "202112190009",
		"workings_id" : 5,
		"prod_id" : 3,
		"plan_qty" : 0.000000,
		"qty" : 0.000000,
		"seq" : null,
		"shift_id" : 3,
		"worker_group_id" : 2,
		"work_fg" : false,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "11ee803c-c940-4fa3-ae18-bb58d78758c8"
	},
	{
		"order_id" : 17,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_no" : "202110250001",
		"workings_id" : 5,
		"prod_id" : 1,
		"plan_qty" : 100.000000,
		"qty" : 1000.000000,
		"seq" : null,
		"shift_id" : 1,
		"worker_group_id" : 1,
		"work_fg" : false,
		"start_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e6c1e0c2-20ff-4bf0-a1ad-9254ffa311b3"
	},
	{
		"order_id" : 18,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_no" : "202110250002",
		"workings_id" : 5,
		"prod_id" : 1,
		"plan_qty" : 200.000000,
		"qty" : 2000.000000,
		"seq" : null,
		"shift_id" : 1,
		"worker_group_id" : 2,
		"work_fg" : false,
		"start_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5e74c6eb-6ad5-46d0-a39f-587f775051c9"
	},
	{
		"order_id" : 19,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_no" : "202110250003",
		"workings_id" : 4,
		"prod_id" : 1,
		"plan_qty" : 300.000000,
		"qty" : 3000.000000,
		"seq" : null,
		"shift_id" : 2,
		"worker_group_id" : 1,
		"work_fg" : false,
		"start_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f715d7e9-47d1-453d-a959-4aafaa128f17"
	},
	{
		"order_id" : 20,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_no" : "202110250004",
		"workings_id" : 3,
		"prod_id" : 1,
		"plan_qty" : 400.000000,
		"qty" : 4000.000000,
		"seq" : null,
		"shift_id" : 1,
		"worker_group_id" : 1,
		"work_fg" : false,
		"start_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "626ec886-6e6f-4112-9c02-759f5588459d"
	},
	{
		"order_id" : 21,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-03T15:00:00.000Z").toString(),
		"order_no" : "202111040001",
		"workings_id" : 3,
		"prod_id" : 2,
		"plan_qty" : 1000.000000,
		"qty" : 2000.000000,
		"seq" : null,
		"shift_id" : 1,
		"worker_group_id" : 1,
		"work_fg" : false,
		"start_date" : moment("2021-11-03T15:00:00.000Z").toString(),
		"end_date" : moment("2021-11-03T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"complete_date" : null,
		"sal_order_detail_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "aff11f1e-70cd-4c47-8505-ec9400a62ceb"
	}
];

const baseMigration = new BaseMigration('PrdOrder', 'order_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };