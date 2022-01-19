import moment = require('moment');
import ISalOrderDetail from '../../interfaces/sal/order-detail.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: ISalOrderDetail[] = [
  {
		"order_detail_id" : 1,
		"order_id" : 1,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 1,
		"qty" : 10.000000,
		"price" : 100.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 1000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-10-16T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ec26f31c-67c9-4ff6-80ae-fb8a39e1f3c2"
	},
	{
		"order_detail_id" : 2,
		"order_id" : 1,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 2,
		"qty" : 10.000000,
		"price" : 500.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 5000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-10-16T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1bcab8ba-1d65-4c3e-b957-63697f2e1e18"
	},
	{
		"order_detail_id" : 3,
		"order_id" : 1,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 4,
		"qty" : 10.000000,
		"price" : 300.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 3000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-10-16T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e7c1c6ea-f2f2-4061-92a1-184a6bf09970"
	},
	{
		"order_detail_id" : 4,
		"order_id" : 2,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 9,
		"qty" : 150.000000,
		"price" : 175.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 26250.000000,
		"unit_qty" : 5.000000,
		"due_date" : moment("2021-10-19T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ea17471f-6f88-401a-aba0-3eedaa725b79"
	},
	{
		"order_detail_id" : 5,
		"order_id" : 2,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 8,
		"qty" : 15.000000,
		"price" : 150.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 2250.000000,
		"unit_qty" : 5.000000,
		"due_date" : moment("2021-10-19T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c9f01272-df3e-4755-9c8f-c5575c128776"
	},
	{
		"order_detail_id" : 6,
		"order_id" : 2,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 7,
		"qty" : 15.000000,
		"price" : 150.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 2250.000000,
		"unit_qty" : 5.000000,
		"due_date" : moment("2021-10-19T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cf98b63a-2ba8-407e-a85e-3798d6fe4d2e"
	},
	{
		"order_detail_id" : 7,
		"order_id" : 2,
		"seq" : 4,
		"factory_id" : 1,
		"prod_id" : 6,
		"qty" : 20.000000,
		"price" : 150.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 3000.000000,
		"unit_qty" : 5.000000,
		"due_date" : moment("2021-10-19T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0f80df95-5666-40d3-b458-6df4e95a37c3"
	},
	{
		"order_detail_id" : 8,
		"order_id" : 5,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 6,
		"qty" : 5.000000,
		"price" : 10.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 50.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-11T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c7188c1f-faa5-460c-8104-2d6c9725f7e1"
	},
	{
		"order_detail_id" : 9,
		"order_id" : 5,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 7,
		"qty" : 10.000000,
		"price" : 10.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 100.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-11T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "22b5c262-0536-4ebb-8c65-ecff48023d66"
	},
	{
		"order_detail_id" : 10,
		"order_id" : 5,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 8,
		"qty" : 15.000000,
		"price" : 10.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 150.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-11T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7be352a1-e6e9-4939-82ff-240b8ad53cb5"
	},
	{
		"order_detail_id" : 11,
		"order_id" : 5,
		"seq" : 4,
		"factory_id" : 1,
		"prod_id" : 9,
		"qty" : 15.000000,
		"price" : 10.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 150.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-11T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "93c92530-590d-4ca4-99bd-71fc71bf270b"
	},
	{
		"order_detail_id" : 12,
		"order_id" : 5,
		"seq" : 5,
		"factory_id" : 1,
		"prod_id" : 5,
		"qty" : 15.000000,
		"price" : 10.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 150.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-11T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a0f7fa78-80c6-4297-86cb-8826a004734b"
	},
	{
		"order_detail_id" : 13,
		"order_id" : 6,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 1,
		"qty" : 10.000000,
		"price" : 100.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 1000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-04T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1940b079-f35d-41fd-81f8-273b6b9f09a8"
	},
	{
		"order_detail_id" : 14,
		"order_id" : 6,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 2,
		"qty" : 10.000000,
		"price" : 500.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 5000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-04T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1be524ac-217f-444b-9970-4c8bf0c9b7dc"
	},
	{
		"order_detail_id" : 15,
		"order_id" : 6,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 4,
		"qty" : 10.000000,
		"price" : 300.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 3000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-04T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "28157a6d-3cd9-4bde-8542-668fb071347a"
	},
	{
		"order_detail_id" : 16,
		"order_id" : 6,
		"seq" : 4,
		"factory_id" : 1,
		"prod_id" : 9,
		"qty" : 15.000000,
		"price" : 10.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 150.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-04T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c38c1de7-43b9-4dc7-afbf-6297fe37c455"
	},
	{
		"order_detail_id" : 17,
		"order_id" : 7,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 2,
		"qty" : 10.000000,
		"price" : 500.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 5000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-17T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "181be998-9bee-4886-9050-42428257ba0f"
	},
	{
		"order_detail_id" : 18,
		"order_id" : 7,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 4,
		"qty" : 10.000000,
		"price" : 300.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 3000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-17T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e6cb86dc-617b-46f1-a08f-7e9da62aa29c"
	},
	{
		"order_detail_id" : 19,
		"order_id" : 7,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 6,
		"qty" : 10.000000,
		"price" : 56.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 560.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-17T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "54ed03be-1895-451e-9ef5-477573cab63f"
	},
	{
		"order_detail_id" : 20,
		"order_id" : 8,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 4,
		"qty" : 5.000000,
		"price" : 300.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 1500.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-01T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "de2dc2e3-ad6e-478c-8ee9-c452b917c53d"
	},
	{
		"order_detail_id" : 21,
		"order_id" : 8,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 6,
		"qty" : 5.000000,
		"price" : 10.000000,
		"money_unit_id" : 3,
		"exchange" : 2.000000,
		"total_price" : 100.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-01T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7041ad1b-52d4-465e-8e59-6bb9376ab04b"
	},
	{
		"order_detail_id" : 22,
		"order_id" : 8,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 9,
		"qty" : 5.000000,
		"price" : 10.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 50.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-01T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ba9c6fdd-8120-482d-8cad-1241a0b2f14d"
	},
	{
		"order_detail_id" : 23,
		"order_id" : 9,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 2,
		"qty" : 50.000000,
		"price" : 2000.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 100000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2022-02-01T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "998583c7-5c00-43cf-adf0-24e7606324f7"
	},
	{
		"order_detail_id" : 24,
		"order_id" : 9,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 5,
		"qty" : 10.000000,
		"price" : 3500.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 35000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2022-02-01T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6577cc87-897a-4ae1-b6ec-4b762bd9a4f7"
	},
	{
		"order_detail_id" : 25,
		"order_id" : 9,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 7,
		"qty" : 20.000000,
		"price" : 2000.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 40000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2022-02-01T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f203af33-45fb-4418-9b99-d8daba2343ee"
	},
	{
		"order_detail_id" : 26,
		"order_id" : 10,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 7,
		"qty" : 88.000000,
		"price" : 2000.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 176000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-31T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0e2c42e6-779e-470f-b810-9853052c209d"
	},
	{
		"order_detail_id" : 27,
		"order_id" : 10,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 1,
		"qty" : 41.000000,
		"price" : 1500.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 61500.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-31T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "94ccc24f-48e6-4a0a-aa6e-f008d17ade43"
	},
	{
		"order_detail_id" : 28,
		"order_id" : 10,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 2,
		"qty" : 20.000000,
		"price" : 2000.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 40000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-31T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2ba284a0-c252-4e94-9493-cd4930125c95"
	},
	{
		"order_detail_id" : 29,
		"order_id" : 11,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 3,
		"qty" : 10.000000,
		"price" : 200.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 2000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-30T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9940d6ca-30e9-4c74-9745-86248173cabc"
	},
	{
		"order_detail_id" : 30,
		"order_id" : 11,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 7,
		"qty" : 20.000000,
		"price" : 10.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 200.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-30T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b9bc0653-d212-4f6c-824b-0914f78565f7"
	},
	{
		"order_detail_id" : 31,
		"order_id" : 11,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 1,
		"qty" : 30.000000,
		"price" : 100.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 3000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-30T15:00:00.000Z").toString(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "180e573a-3a05-4aa7-b6fb-83495c449f46"
	}
];

const baseMigration = new BaseMigration('SalOrderDetail', 'order_detail_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };