import moment = require('moment');
import IPrdWork from '../../interfaces/prd/work.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IPrdWork[] = [
  {
		"work_id" : 1,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 1,
		"seq" : 1,
		"proc_id" : 4,
		"workings_id" : 3,
		"equip_id" : 5,
		"prod_id" : 1,
		"lot_no" : "20211025",
		"qty" : 50.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 2,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f39e8fcc-cb79-4e9f-9dbd-bec62eb5c739"
	},
	{
		"work_id" : 2,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 2,
		"seq" : 1,
		"proc_id" : 4,
		"workings_id" : 4,
		"equip_id" : 5,
		"prod_id" : 1,
		"lot_no" : "20211025",
		"qty" : 150.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 1,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3dd2326f-1cf6-45df-be4d-17dfd2277459"
	},
	{
		"work_id" : 3,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 3,
		"seq" : 1,
		"proc_id" : 4,
		"workings_id" : 5,
		"equip_id" : 5,
		"prod_id" : 1,
		"lot_no" : "20211025",
		"qty" : 100.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-25T01:46:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 1,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6af2eda3-7537-47b3-96b5-7c9886c96f0c"
	},
	{
		"work_id" : 4,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 4,
		"seq" : 1,
		"proc_id" : 3,
		"workings_id" : 3,
		"equip_id" : 1,
		"prod_id" : 5,
		"lot_no" : "20211025",
		"qty" : 60.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-25T01:43:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 2,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cfb29c82-9ff1-4040-8260-0e7a4c5404e9"
	},
	{
		"work_id" : 5,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 1,
		"seq" : 2,
		"proc_id" : 4,
		"workings_id" : 3,
		"equip_id" : 5,
		"prod_id" : 1,
		"lot_no" : "20211025",
		"qty" : 50.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-25T01:46:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 2,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4f59efd1-253f-4baf-bc2c-b273cd3abd8a"
	},
	{
		"work_id" : 6,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 2,
		"seq" : 2,
		"proc_id" : 4,
		"workings_id" : 4,
		"equip_id" : 5,
		"prod_id" : 1,
		"lot_no" : "20211025",
		"qty" : 0.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-25T02:11:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 1,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "288cf4a1-6b35-450e-b05a-0863e454179a"
	},
	{
		"work_id" : 7,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 3,
		"seq" : 2,
		"proc_id" : 4,
		"workings_id" : 5,
		"equip_id" : 5,
		"prod_id" : 1,
		"lot_no" : "20211025",
		"qty" : 0.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-25T02:11:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 1,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0f4e9281-0d4f-4450-aca5-542b849ef18e"
	},
	{
		"work_id" : 8,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 4,
		"seq" : 2,
		"proc_id" : 3,
		"workings_id" : 3,
		"equip_id" : 1,
		"prod_id" : 5,
		"lot_no" : "20211025",
		"qty" : 0.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-25T02:11:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 2,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bfdac1f0-46b8-4fb1-b4e0-6516388ffaaf"
	},
	{
		"work_id" : 9,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 1,
		"seq" : 3,
		"proc_id" : 4,
		"workings_id" : 3,
		"equip_id" : 5,
		"prod_id" : 1,
		"lot_no" : "20211025",
		"qty" : 100.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-10-25T02:28:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 2,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1c1f4b3e-0616-4ab2-8d4b-80ed34afbfda"
	},
	{
		"work_id" : 11,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 5,
		"seq" : 1,
		"proc_id" : 3,
		"workings_id" : 1,
		"equip_id" : 1,
		"prod_id" : 5,
		"lot_no" : "20211025",
		"qty" : 200.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-12-17T02:55:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 2,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "74a6af44-911d-4532-a94b-97e74b166f8b"
	},
	{
		"work_id" : 13,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 7,
		"seq" : 1,
		"proc_id" : 3,
		"workings_id" : 5,
		"equip_id" : 1,
		"prod_id" : 3,
		"lot_no" : "20211025",
		"qty" : 100.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-12-17T02:55:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 2,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ed3c17e5-6115-44b3-9087-fbad96ed2b68"
	},
	{
		"work_id" : 14,
		"factory_id" : 1,
		"reg_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"order_id" : 8,
		"seq" : 1,
		"proc_id" : 4,
		"workings_id" : 3,
		"equip_id" : 5,
		"prod_id" : 1,
		"lot_no" : "20211025",
		"qty" : 0.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-12-17T02:55:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 3,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e0d0ffd7-7ab6-4e07-8999-611112da134e"
	},
	{
		"work_id" : 15,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-16T15:00:00.000Z").toString(),
		"order_id" : 7,
		"seq" : 2,
		"proc_id" : 3,
		"workings_id" : 5,
		"equip_id" : 1,
		"prod_id" : 3,
		"lot_no" : "20211217",
		"qty" : 200.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-12-16T15:00:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 2,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8a4cf06b-8740-4a58-93a5-0c8ac6695fe7"
	},
	{
		"work_id" : 16,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-16T15:00:00.000Z").toString(),
		"order_id" : 16,
		"seq" : 1,
		"proc_id" : 3,
		"workings_id" : 5,
		"equip_id" : 1,
		"prod_id" : 3,
		"lot_no" : "20211217",
		"qty" : 150.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-12-17T03:18:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 3,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c3cda853-06bd-4c77-91f7-22c56f425d96"
	},
	{
		"work_id" : 17,
		"factory_id" : 1,
		"reg_date" : moment("2021-12-16T15:00:00.000Z").toString(),
		"order_id" : 18,
		"seq" : 1,
		"proc_id" : 4,
		"workings_id" : 5,
		"equip_id" : 5,
		"prod_id" : 1,
		"lot_no" : "20211217",
		"qty" : 500.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-24T15:00:00.000Z").toString(),
		"end_date" : moment("2021-12-17T03:18:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 1,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "324095ce-2c3d-4ca6-90e7-8cdde2c263ee"
	},
	{
		"work_id" : 18,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-03T15:00:00.000Z").toString(),
		"order_id" : 12,
		"seq" : 1,
		"proc_id" : 5,
		"workings_id" : 2,
		"equip_id" : 4,
		"prod_id" : 8,
		"lot_no" : "20211104",
		"qty" : 100.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-11-03T15:00:00.000Z").toString(),
		"end_date" : moment("2021-11-04T07:00:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 2,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0ac80602-621f-415e-9815-8746186d1806"
	},
	{
		"work_id" : 19,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-03T15:00:00.000Z").toString(),
		"order_id" : 13,
		"seq" : 1,
		"proc_id" : 5,
		"workings_id" : 1,
		"equip_id" : 4,
		"prod_id" : 8,
		"lot_no" : "20211104",
		"qty" : 200.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-11-04T07:00:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 3,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3a126dbf-50dd-43d7-84de-7776bfb1a251"
	},
	{
		"work_id" : 20,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-03T15:00:00.000Z").toString(),
		"order_id" : 14,
		"seq" : 1,
		"proc_id" : 4,
		"workings_id" : 3,
		"equip_id" : 5,
		"prod_id" : 1,
		"lot_no" : "20211104",
		"qty" : 100.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : moment("2021-11-04T07:00:00.000Z").toString(),
		"work_time" : null,
		"shift_id" : 1,
		"complete_fg" : true,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bc04c3b3-5c38-435c-add5-7e490533287f"
	},
	{
		"work_id" : 21,
		"factory_id" : 1,
		"reg_date" : moment("2021-11-03T15:00:00.000Z").toString(),
		"order_id" : 1,
		"seq" : 4,
		"proc_id" : 4,
		"workings_id" : 3,
		"equip_id" : 5,
		"prod_id" : 1,
		"lot_no" : "20211104",
		"qty" : 50.000000,
		"reject_qty" : 0.000000,
		"start_date" : moment("2021-10-18T15:00:00.000Z").toString(),
		"end_date" : null,
		"work_time" : null,
		"shift_id" : 2,
		"complete_fg" : false,
		"to_store_id" : 2,
		"to_location_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "259a5ae7-7ea9-4fa7-9198-9de3389f4df4"
	}
];

const baseMigration = new BaseMigration('PrdWork', 'work_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };