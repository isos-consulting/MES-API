import moment = require('moment');
import IMatOrderDetail from '../../interfaces/mat/order-detail.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IMatOrderDetail[] = [
  {
		"order_detail_id" : 1,
		"order_id" : 1,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 16,
		"unit_id" : 5,
		"qty" : 50.000000,
		"price" : 3000.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 150000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"complete_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3fe2bb3d-c612-42f7-ae72-947789e8a89d"
	},
	{
		"order_detail_id" : 2,
		"order_id" : 1,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 20,
		"unit_id" : 5,
		"qty" : 20.000000,
		"price" : 7500.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 150000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "536be09b-d96d-4581-aab4-774dd27d1cee"
	},
	{
		"order_detail_id" : 3,
		"order_id" : 1,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 18,
		"unit_id" : 5,
		"qty" : 30.000000,
		"price" : 5400.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 162000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "97fd0f60-a152-4a7e-9045-ac7d9fb5258a"
	},
	{
		"order_detail_id" : 4,
		"order_id" : 1,
		"seq" : 4,
		"factory_id" : 1,
		"prod_id" : 22,
		"unit_id" : 5,
		"qty" : 40.000000,
		"price" : 1850.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 74000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "378acc66-d514-47de-a3bc-1619d5a22264"
	},
	{
		"order_detail_id" : 5,
		"order_id" : 1,
		"seq" : 5,
		"factory_id" : 1,
		"prod_id" : 26,
		"unit_id" : 5,
		"qty" : 10.000000,
		"price" : 11457.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 114570.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b698b329-063c-48b0-8dbb-921eccbbb443"
	},
	{
		"order_detail_id" : 6,
		"order_id" : 1,
		"seq" : 6,
		"factory_id" : 1,
		"prod_id" : 27,
		"unit_id" : 5,
		"qty" : 20.000000,
		"price" : 12458.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 249160.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2022-02-01T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "182ef579-4368-45ab-9923-e615b9a50ca2"
	},
	{
		"order_detail_id" : 7,
		"order_id" : 2,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 22,
		"unit_id" : 5,
		"qty" : 10.000000,
		"price" : 1850.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 18500.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-01T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9776accc-3266-4d83-8ea6-61750f8e19cd"
	},
	{
		"order_detail_id" : 8,
		"order_id" : 2,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 20,
		"unit_id" : 5,
		"qty" : 20.000000,
		"price" : 7500.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 150000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-01T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b7c54056-e034-4e37-9375-db3a9a8c63b7"
	},
	{
		"order_detail_id" : 9,
		"order_id" : 2,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 16,
		"unit_id" : 5,
		"qty" : 30.000000,
		"price" : 3000.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 90000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-01T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bc24c2dc-2fa6-43bd-bed2-4bd693d450df"
	},
	{
		"order_detail_id" : 10,
		"order_id" : 2,
		"seq" : 4,
		"factory_id" : 1,
		"prod_id" : 26,
		"unit_id" : 5,
		"qty" : 40.000000,
		"price" : 11457.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 458280.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-01T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a460d78d-2fb7-4b2a-8a45-3bc86fd925f4"
	},
	{
		"order_detail_id" : 11,
		"order_id" : 3,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 18,
		"unit_id" : 5,
		"qty" : 10.000000,
		"price" : 5400.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 54000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-05-04T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d3ef894e-bd4b-474e-8689-6403bee020b5"
	},
	{
		"order_detail_id" : 12,
		"order_id" : 3,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 22,
		"unit_id" : 5,
		"qty" : 20.000000,
		"price" : 1850.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 37000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-05-04T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2436ecca-04fe-49f9-b9eb-ac656d68185c"
	},
	{
		"order_detail_id" : 13,
		"order_id" : 3,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 27,
		"unit_id" : 5,
		"qty" : 30.000000,
		"price" : 12458.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 373740.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-05-04T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3024e5bb-eaaa-4fa6-9e0e-4bbf0e43fab0"
	},
	{
		"order_detail_id" : 14,
		"order_id" : 4,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 26,
		"unit_id" : 5,
		"qty" : 5.000000,
		"price" : 11457.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 57285.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f46b16a7-4b4c-4041-a91e-1ee53b3567c8"
	},
	{
		"order_detail_id" : 15,
		"order_id" : 4,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 20,
		"unit_id" : 5,
		"qty" : 10.000000,
		"price" : 7500.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 75000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "df0b22d2-545f-4ab2-81ca-edfe33758ea6"
	},
	{
		"order_detail_id" : 16,
		"order_id" : 4,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 18,
		"unit_id" : 5,
		"qty" : 5.000000,
		"price" : 5400.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 27000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2ced8699-5ff4-4db6-a0f0-e02ae05e0c10"
	},
	{
		"order_detail_id" : 19,
		"order_id" : 5,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 20,
		"unit_id" : 5,
		"qty" : 10.000000,
		"price" : 7500.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 75000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-04T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e36c946a-5ce0-49cd-a770-f622506e58bb"
	},
	{
		"order_detail_id" : 20,
		"order_id" : 5,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 24,
		"unit_id" : 5,
		"qty" : 20.000000,
		"price" : 1254.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 25080.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-04T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4f198712-16dc-47b0-bb73-ec33c35dd5d9"
	},
	{
		"order_detail_id" : 21,
		"order_id" : 5,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 27,
		"unit_id" : 5,
		"qty" : 5.000000,
		"price" : 12458.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 62290.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-04T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3209f2de-e831-4ccf-b92d-bdfe9fc57fda"
	},
	{
		"order_detail_id" : 22,
		"order_id" : 6,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 24,
		"unit_id" : 5,
		"qty" : 10.000000,
		"price" : 1254.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 12540.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-07T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2d9a9526-90df-496b-9bb3-6310426e8111"
	},
	{
		"order_detail_id" : 23,
		"order_id" : 6,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 22,
		"unit_id" : 5,
		"qty" : 70.000000,
		"price" : 1850.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 129500.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-07T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9c53d859-272c-483a-9332-1e84dccc729d"
	},
	{
		"order_detail_id" : 24,
		"order_id" : 6,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 20,
		"unit_id" : 5,
		"qty" : 50.000000,
		"price" : 7500.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 375000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-07T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8facc17b-c437-4857-a387-9aaa2b5e04b8"
	},
	{
		"order_detail_id" : 25,
		"order_id" : 6,
		"seq" : 4,
		"factory_id" : 1,
		"prod_id" : 18,
		"unit_id" : 5,
		"qty" : 50.000000,
		"price" : 5400.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 270000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-07T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "75f283a5-2d46-4c36-a978-52e567b26693"
	},
	{
		"order_detail_id" : 26,
		"order_id" : 7,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 16,
		"unit_id" : 5,
		"qty" : 10.000000,
		"price" : 3000.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 30000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-29T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "aae59783-e2d4-409a-a77d-2131151054c5"
	},
	{
		"order_detail_id" : 27,
		"order_id" : 7,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 20,
		"unit_id" : 5,
		"qty" : 50.000000,
		"price" : 7500.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 375000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-29T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a9f113ac-c7a4-4372-ae2c-33f9cb753bae"
	},
	{
		"order_detail_id" : 28,
		"order_id" : 7,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 22,
		"unit_id" : 5,
		"qty" : 60.000000,
		"price" : 1850.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 111000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-29T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2e9de8cb-97d0-4a10-95dc-a7c1f529587b"
	},
	{
		"order_detail_id" : 29,
		"order_id" : 8,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 22,
		"unit_id" : 5,
		"qty" : 10.000000,
		"price" : 1850.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 18500.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-29T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bf250187-9f17-43ab-bcf2-a3ac3594a846"
	},
	{
		"order_detail_id" : 30,
		"order_id" : 8,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 20,
		"unit_id" : 5,
		"qty" : 20.000000,
		"price" : 7500.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 150000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-29T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "79f5933a-ef7f-45e9-a5f8-bd246c012756"
	},
	{
		"order_detail_id" : 31,
		"order_id" : 8,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 16,
		"unit_id" : 5,
		"qty" : 40.000000,
		"price" : 3000.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 120000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-29T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "00b43f7b-c316-4715-8844-5f43fda908b7"
	},
	{
		"order_detail_id" : 32,
		"order_id" : 9,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 20,
		"unit_id" : 5,
		"qty" : 10.000000,
		"price" : 7500.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 75000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2022-01-04T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6b61d491-3264-4a39-b08f-ad56fae26a00"
	},
	{
		"order_detail_id" : 33,
		"order_id" : 9,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 24,
		"unit_id" : 5,
		"qty" : 80.000000,
		"price" : 1254.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 100320.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2022-01-04T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "56380874-b01f-4dc8-bbe0-7a8753d9ce22"
	},
	{
		"order_detail_id" : 34,
		"order_id" : 9,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 27,
		"unit_id" : 5,
		"qty" : 70.000000,
		"price" : 12458.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 872060.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2022-01-04T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bedf232b-9509-4681-ad52-70a6829707b5"
	},
	{
		"order_detail_id" : 35,
		"order_id" : 9,
		"seq" : 4,
		"factory_id" : 1,
		"prod_id" : 18,
		"unit_id" : 5,
		"qty" : 50.000000,
		"price" : 5400.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 270000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2022-01-04T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "61a568e5-879c-46f4-b1d7-09191329f832"
	},
	{
		"order_detail_id" : 36,
		"order_id" : 10,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 18,
		"unit_id" : 5,
		"qty" : 8.000000,
		"price" : 5400.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 43200.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-30T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4c30c10b-85f7-43a5-b2ce-1ab1d36c6eae"
	},
	{
		"order_detail_id" : 37,
		"order_id" : 10,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 16,
		"unit_id" : 5,
		"qty" : 7.000000,
		"price" : 3000.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 21000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-30T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b65d25ef-7c82-4294-aefe-d668bbc374bf"
	},
	{
		"order_detail_id" : 38,
		"order_id" : 10,
		"seq" : 3,
		"factory_id" : 1,
		"prod_id" : 24,
		"unit_id" : 5,
		"qty" : 10.000000,
		"price" : 1254.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 12540.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-30T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4a78b0a9-f83e-464f-8443-5e7dfda55813"
	},
	{
		"order_detail_id" : 39,
		"order_id" : 17,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 13,
		"unit_id" : 5,
		"qty" : 20.000000,
		"price" : 2100.000000,
		"money_unit_id" : 2,
		"exchange" : 1.000000,
		"total_price" : 42000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-30T15:00:00.000Z").toDate(),
		"complete_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3d851c33-856a-433f-8cb9-2cfc290798a6"
	},
	{
		"order_detail_id" : 40,
		"order_id" : 18,
		"seq" : 1,
		"factory_id" : 1,
		"prod_id" : 11,
		"unit_id" : 5,
		"qty" : 100.000000,
		"price" : 1250.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 125000.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-01T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d927001d-9043-4f56-9b60-7cb48ed16fb3"
	},
	{
		"order_detail_id" : 41,
		"order_id" : 18,
		"seq" : 2,
		"factory_id" : 1,
		"prod_id" : 13,
		"unit_id" : 5,
		"qty" : 100.000000,
		"price" : 2235.000000,
		"money_unit_id" : 3,
		"exchange" : 1.000000,
		"total_price" : 223500.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-11-01T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a0637dca-e185-4c96-856d-70ea06a02ef8"
	},
	{
		"order_detail_id" : 42,
		"order_id" : 7,
		"seq" : 4,
		"factory_id" : 1,
		"prod_id" : 26,
		"unit_id" : 5,
		"qty" : 2.000000,
		"price" : 11457.000000,
		"money_unit_id" : 1,
		"exchange" : 1.000000,
		"total_price" : 22914.000000,
		"unit_qty" : 0.000000,
		"due_date" : moment("2021-12-30T15:00:00.000Z").toDate(),
		"complete_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9cfdedcb-5346-45c6-a954-e742df5071e1"
	}
]

const baseMigration = new BaseMigration('MatOrderDetail', 'order_detail_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };