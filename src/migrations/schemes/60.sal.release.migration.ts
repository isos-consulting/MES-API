import moment = require('moment');
import ISalRelease from '../../interfaces/sal/release.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: ISalRelease[] = [
  {
		"release_id" : 1,
		"factory_id" : 1,
		"prod_id" : 9,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 150.000000,
		"order_detail_id" : 4,
		"outgo_order_detail_id" : null,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "753ef89c-827f-4a23-b98f-b99e59c39630"
	},
	{
		"release_id" : 2,
		"factory_id" : 1,
		"prod_id" : 9,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 15.000000,
		"order_detail_id" : 11,
		"outgo_order_detail_id" : null,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "351cda47-a8ad-40c5-8ee3-230b6fb6d8ba"
	},
	{
		"release_id" : 3,
		"factory_id" : 1,
		"prod_id" : 9,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 5.000000,
		"order_detail_id" : 22,
		"outgo_order_detail_id" : null,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "56fde063-379a-40b6-b420-0d59ad3e2bd5"
	},
	{
		"release_id" : 4,
		"factory_id" : 1,
		"prod_id" : 9,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 15.000000,
		"order_detail_id" : 16,
		"outgo_order_detail_id" : null,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "43468a78-0679-44ec-9a30-39980ab52357"
	},
	{
		"release_id" : 5,
		"factory_id" : 1,
		"prod_id" : 2,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 10.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : 19,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e5d025c2-6289-4bd5-8da4-cc2cf894a6ed"
	},
	{
		"release_id" : 6,
		"factory_id" : 1,
		"prod_id" : 5,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 20.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : 20,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "acc5dbce-60b9-4289-923d-292e2391d329"
	},
	{
		"release_id" : 7,
		"factory_id" : 1,
		"prod_id" : 6,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"lot_no" : "SILSA002",
		"qty" : 10.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : 21,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ccb5af91-12f8-44da-a43d-7943a60526b5"
	},
	{
		"release_id" : 8,
		"factory_id" : 1,
		"prod_id" : 6,
		"reg_date" : moment("2021-11-10T15:00:00.000Z").toString(),
		"lot_no" : "SILSA002",
		"qty" : 10.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : 21,
		"from_store_id" : 4,
		"from_location_id" : 4,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "11c03737-3aa2-4280-8630-6e88b6477be4"
	},
	{
		"release_id" : 9,
		"factory_id" : 1,
		"prod_id" : 6,
		"reg_date" : moment("2021-12-01T15:00:00.000Z").toString(),
		"lot_no" : "SILSA001",
		"qty" : 1000.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : null,
		"from_store_id" : 4,
		"from_location_id" : 4,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7efcd517-1d57-45e3-bf7c-9abe6f92ecbf"
	},
	{
		"release_id" : 10,
		"factory_id" : 1,
		"prod_id" : 6,
		"reg_date" : moment("2021-12-01T15:00:00.000Z").toString(),
		"lot_no" : "SILSA001",
		"qty" : 850.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : null,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5ecc5f8d-0090-4d08-a30c-d5f5de7b5490"
	},
	{
		"release_id" : 11,
		"factory_id" : 1,
		"prod_id" : 5,
		"reg_date" : moment("2021-12-01T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 980.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : null,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a2797d5a-b299-4e3e-b2e4-5bd776dc4c99"
	},
	{
		"release_id" : 12,
		"factory_id" : 1,
		"prod_id" : 2,
		"reg_date" : moment("2021-12-01T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 10.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : 9,
		"from_store_id" : 3,
		"from_location_id" : 4,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "82b2853a-ab3d-4651-b504-7ff581d5c20e"
	},
	{
		"release_id" : 13,
		"factory_id" : 1,
		"prod_id" : 2,
		"reg_date" : moment("2021-10-01T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 40.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : 9,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e6157a54-474a-4269-9972-eaf4debe456e"
	},
	{
		"release_id" : 14,
		"factory_id" : 1,
		"prod_id" : 2,
		"reg_date" : moment("2021-10-01T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 30.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : 2,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a28515db-134e-4830-85a5-8fb6d5090481"
	},
	{
		"release_id" : 15,
		"factory_id" : 1,
		"prod_id" : 2,
		"reg_date" : moment("2021-10-01T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 30.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : 2,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e3e66bf8-20c9-4e79-8896-db09e6eb0ae1"
	},
	{
		"release_id" : 16,
		"factory_id" : 1,
		"prod_id" : 2,
		"reg_date" : moment("2021-11-24T15:00:00.000Z").toString(),
		"lot_no" : "TEST001",
		"qty" : 30.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : 2,
		"from_store_id" : 2,
		"from_location_id" : 2,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cb69cbfa-6ada-42e2-99aa-3f3ef1944c98"
	},
	{
		"release_id" : 17,
		"factory_id" : 1,
		"prod_id" : 1,
		"reg_date" : moment("2021-11-24T15:00:00.000Z").toString(),
		"lot_no" : "test002",
		"qty" : 20.000000,
		"order_detail_id" : null,
		"outgo_order_detail_id" : 1,
		"from_store_id" : 3,
		"from_location_id" : 4,
		"to_store_id" : 3,
		"to_location_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "97a64961-69d9-4550-a63f-919ab60aeb53"
	}
];

const baseMigration = new BaseMigration('SalRelease', 'release_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };