import moment = require('moment');
import IPrdWorkWorker from '../../interfaces/prd/work-worker.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IPrdWorkWorker[] = [
  {
		"work_worker_id" : 1,
		"factory_id" : 1,
		"work_id" : 1,
		"emp_id" : 1,
		"start_date" : moment("2021-10-25T00:00:00.000Z").toString(),
		"end_date" : moment("2021-10-25T01:00:00.000Z").toString(),
		"work_time" : 60.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e755bf14-f10c-469c-ab5f-04d963010402"
	},
	{
		"work_worker_id" : 2,
		"factory_id" : 1,
		"work_id" : 1,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "80b3b530-a360-4f51-988b-d4f6e8eebed2"
	},
	{
		"work_worker_id" : 3,
		"factory_id" : 1,
		"work_id" : 1,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f66fb409-41ab-448d-aba6-1548d3abb6b9"
	},
	{
		"work_worker_id" : 4,
		"factory_id" : 1,
		"work_id" : 1,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "04df8dbd-96b4-4f5d-a057-ff1067379c65"
	},
	{
		"work_worker_id" : 5,
		"factory_id" : 1,
		"work_id" : 1,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "09f34a99-f6df-4ee0-a8bf-59e1623d7727"
	},
	{
		"work_worker_id" : 6,
		"factory_id" : 1,
		"work_id" : 2,
		"emp_id" : 1,
		"start_date" : moment("2021-10-25T00:00:00.000Z").toString(),
		"end_date" : moment("2021-10-25T01:00:00.000Z").toString(),
		"work_time" : 60.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "93a1cce1-1ea7-4e49-b090-54237fff4812"
	},
	{
		"work_worker_id" : 7,
		"factory_id" : 1,
		"work_id" : 2,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "882cbcd0-be56-4c12-98ab-e6c82711326b"
	},
	{
		"work_worker_id" : 8,
		"factory_id" : 1,
		"work_id" : 2,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "368dca3f-63f8-42b3-a6c9-af76c4bf0463"
	},
	{
		"work_worker_id" : 9,
		"factory_id" : 1,
		"work_id" : 2,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "84e1f303-6cf4-4edd-9251-de923f0eb15d"
	},
	{
		"work_worker_id" : 10,
		"factory_id" : 1,
		"work_id" : 2,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f975fee0-da6b-4f53-ae1a-c96de52cc9ea"
	},
	{
		"work_worker_id" : 11,
		"factory_id" : 1,
		"work_id" : 3,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c5392834-9744-4de5-9276-f230a70b4e7c"
	},
	{
		"work_worker_id" : 12,
		"factory_id" : 1,
		"work_id" : 3,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5b178412-35d9-4f5d-bb74-077eb247cb9e"
	},
	{
		"work_worker_id" : 13,
		"factory_id" : 1,
		"work_id" : 3,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "053f4575-00db-47b4-a85d-dba0e5d9cac2"
	},
	{
		"work_worker_id" : 14,
		"factory_id" : 1,
		"work_id" : 3,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c3352a9f-dc11-452c-be87-000f50215cdb"
	},
	{
		"work_worker_id" : 15,
		"factory_id" : 1,
		"work_id" : 3,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "74941d9f-4ec1-4863-9b70-ed887c04c385"
	},
	{
		"work_worker_id" : 16,
		"factory_id" : 1,
		"work_id" : 4,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8425892c-3885-44af-a3fe-b3ee004a00d2"
	},
	{
		"work_worker_id" : 17,
		"factory_id" : 1,
		"work_id" : 4,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0af8f2d2-5fda-4a21-bff2-e18777393c43"
	},
	{
		"work_worker_id" : 18,
		"factory_id" : 1,
		"work_id" : 4,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f93c18fe-f551-4a83-b8ec-bfe4cbad67b2"
	},
	{
		"work_worker_id" : 19,
		"factory_id" : 1,
		"work_id" : 4,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0b446874-a8a0-45c6-8e1e-00a93106ff94"
	},
	{
		"work_worker_id" : 20,
		"factory_id" : 1,
		"work_id" : 4,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c85dc2d0-ee0f-4bb2-b030-fc36e2ab84c4"
	},
	{
		"work_worker_id" : 21,
		"factory_id" : 1,
		"work_id" : 5,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "90038d71-b62d-4de7-b5fd-d4d016262225"
	},
	{
		"work_worker_id" : 22,
		"factory_id" : 1,
		"work_id" : 5,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c9d3014c-fe6b-4702-a484-0406d48fec2f"
	},
	{
		"work_worker_id" : 23,
		"factory_id" : 1,
		"work_id" : 5,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7ef2db1c-6659-4a66-808b-5bf07d32269f"
	},
	{
		"work_worker_id" : 24,
		"factory_id" : 1,
		"work_id" : 5,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "904eabda-6dbb-4e29-958f-d79a035f3a59"
	},
	{
		"work_worker_id" : 25,
		"factory_id" : 1,
		"work_id" : 5,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "57020853-91fe-4b6f-b0dd-a9c505d0b88f"
	},
	{
		"work_worker_id" : 26,
		"factory_id" : 1,
		"work_id" : 6,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2714b40c-bcf7-4737-93ed-23943274c028"
	},
	{
		"work_worker_id" : 27,
		"factory_id" : 1,
		"work_id" : 6,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e32db541-031b-42b7-91ec-fe4bcd1de95f"
	},
	{
		"work_worker_id" : 28,
		"factory_id" : 1,
		"work_id" : 6,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0ef6ee76-1920-4af4-832f-37e4148cd7e7"
	},
	{
		"work_worker_id" : 29,
		"factory_id" : 1,
		"work_id" : 6,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "264f89ef-b17b-45ed-ab15-417e905442d8"
	},
	{
		"work_worker_id" : 30,
		"factory_id" : 1,
		"work_id" : 6,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "36dbafcc-ab7d-4e6b-80f1-3c54e56f07c9"
	},
	{
		"work_worker_id" : 31,
		"factory_id" : 1,
		"work_id" : 7,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6eb1813c-c91d-4e4e-99fb-22f8b0fa23fc"
	},
	{
		"work_worker_id" : 32,
		"factory_id" : 1,
		"work_id" : 7,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "026d7295-dc26-4172-bbdf-f4f68d229031"
	},
	{
		"work_worker_id" : 33,
		"factory_id" : 1,
		"work_id" : 7,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3e52db43-b527-44a4-b6f5-0682412d8c85"
	},
	{
		"work_worker_id" : 34,
		"factory_id" : 1,
		"work_id" : 7,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7cf20352-e6ce-4e80-a538-6b6253ff3169"
	},
	{
		"work_worker_id" : 35,
		"factory_id" : 1,
		"work_id" : 7,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fcdf53a5-b5dc-404a-aa4e-96bfbf7c9720"
	},
	{
		"work_worker_id" : 36,
		"factory_id" : 1,
		"work_id" : 8,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7d17cc75-f11f-4527-9487-72cbbab1bd85"
	},
	{
		"work_worker_id" : 37,
		"factory_id" : 1,
		"work_id" : 8,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "98993dd4-2774-4f36-814a-d01d427dc4a7"
	},
	{
		"work_worker_id" : 38,
		"factory_id" : 1,
		"work_id" : 8,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3df0056a-4e6b-4c60-b74d-d702e5957073"
	},
	{
		"work_worker_id" : 39,
		"factory_id" : 1,
		"work_id" : 8,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2d196a01-ce58-4661-a11d-8d585b21f4e1"
	},
	{
		"work_worker_id" : 40,
		"factory_id" : 1,
		"work_id" : 8,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "24ffab68-3467-48d1-a8e4-b2a8beb48fe3"
	},
	{
		"work_worker_id" : 41,
		"factory_id" : 1,
		"work_id" : 9,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c3081646-05f9-4017-8943-03491e1ceb12"
	},
	{
		"work_worker_id" : 42,
		"factory_id" : 1,
		"work_id" : 9,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d6ab7181-7ef6-4986-bb2c-14a15c41fc5a"
	},
	{
		"work_worker_id" : 43,
		"factory_id" : 1,
		"work_id" : 9,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e8174411-8670-4c48-98a9-abcd45545b8b"
	},
	{
		"work_worker_id" : 44,
		"factory_id" : 1,
		"work_id" : 9,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "beca3b11-58b0-40d4-967a-334ec7ebf742"
	},
	{
		"work_worker_id" : 45,
		"factory_id" : 1,
		"work_id" : 9,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cd33074f-f26d-4c9f-97dd-21e307222488"
	},
	{
		"work_worker_id" : 51,
		"factory_id" : 1,
		"work_id" : 11,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3e22eed0-2d40-4f15-a11b-5e2348515c9c"
	},
	{
		"work_worker_id" : 52,
		"factory_id" : 1,
		"work_id" : 11,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "15ba155e-4f4e-4656-a6b5-aa71ea27f2bb"
	},
	{
		"work_worker_id" : 53,
		"factory_id" : 1,
		"work_id" : 11,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0a702b2e-6b4b-411e-bed5-8c492433a834"
	},
	{
		"work_worker_id" : 54,
		"factory_id" : 1,
		"work_id" : 11,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f3e9162e-9e8d-4027-9fda-2c1baefc5a39"
	},
	{
		"work_worker_id" : 55,
		"factory_id" : 1,
		"work_id" : 11,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fcb024ba-2c24-4f02-a780-a2a7cfb20c72"
	},
	{
		"work_worker_id" : 61,
		"factory_id" : 1,
		"work_id" : 13,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2221ea2e-95b7-4c2f-927b-67ae7acc83ef"
	},
	{
		"work_worker_id" : 62,
		"factory_id" : 1,
		"work_id" : 13,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9f437c21-ae8a-4b2f-a245-6ec2418f3ba1"
	},
	{
		"work_worker_id" : 63,
		"factory_id" : 1,
		"work_id" : 13,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3ff121ab-bd3b-4e93-93bd-e3cdb44d15bb"
	},
	{
		"work_worker_id" : 64,
		"factory_id" : 1,
		"work_id" : 13,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "44d656c4-f10e-49a4-b74c-8667b5276149"
	},
	{
		"work_worker_id" : 65,
		"factory_id" : 1,
		"work_id" : 13,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1b0a992d-0599-4696-be67-c2f6e6be0c87"
	},
	{
		"work_worker_id" : 66,
		"factory_id" : 1,
		"work_id" : 14,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "70b2ae35-3a0d-43c6-9122-66a85c349e37"
	},
	{
		"work_worker_id" : 67,
		"factory_id" : 1,
		"work_id" : 14,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "33a99d34-9af4-4d80-a1ba-850660111abd"
	},
	{
		"work_worker_id" : 68,
		"factory_id" : 1,
		"work_id" : 14,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b45b3cc6-7609-4b4f-b14e-9020cf4ca7e9"
	},
	{
		"work_worker_id" : 69,
		"factory_id" : 1,
		"work_id" : 14,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2ca1ffaa-bcf4-45b8-b9bb-a3189f376a35"
	},
	{
		"work_worker_id" : 70,
		"factory_id" : 1,
		"work_id" : 14,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d0fb9177-96da-4532-99f6-bd77a379d91b"
	},
	{
		"work_worker_id" : 71,
		"factory_id" : 1,
		"work_id" : 15,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3c40863d-3b82-453c-a1a3-91242c922651"
	},
	{
		"work_worker_id" : 72,
		"factory_id" : 1,
		"work_id" : 15,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "836dfa36-f169-4e56-90b7-0a28b8803cc9"
	},
	{
		"work_worker_id" : 73,
		"factory_id" : 1,
		"work_id" : 15,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2a59e01d-ed47-4c40-ae17-45405c56f79d"
	},
	{
		"work_worker_id" : 74,
		"factory_id" : 1,
		"work_id" : 15,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "efc1fbec-f639-4e55-b33c-60b39c8a9f33"
	},
	{
		"work_worker_id" : 75,
		"factory_id" : 1,
		"work_id" : 15,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b2d3e81b-a1df-43c7-b13e-89d57fdec214"
	},
	{
		"work_worker_id" : 76,
		"factory_id" : 1,
		"work_id" : 16,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "806eafc0-e765-4d9b-beed-02353fd9ea77"
	},
	{
		"work_worker_id" : 77,
		"factory_id" : 1,
		"work_id" : 16,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "22405fa6-f0b0-4c3a-84c0-86a7674f1b14"
	},
	{
		"work_worker_id" : 78,
		"factory_id" : 1,
		"work_id" : 16,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "67253a76-932a-410b-b3db-3c69ef4d03f4"
	},
	{
		"work_worker_id" : 79,
		"factory_id" : 1,
		"work_id" : 16,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d1750d34-2f61-43d0-a42b-fda005b6eb16"
	},
	{
		"work_worker_id" : 80,
		"factory_id" : 1,
		"work_id" : 16,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e51ad6ff-4ea5-45ec-af5d-4d8e8cd04c7f"
	},
	{
		"work_worker_id" : 81,
		"factory_id" : 1,
		"work_id" : 17,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "48872654-f28b-49b7-9021-2756f364f473"
	},
	{
		"work_worker_id" : 82,
		"factory_id" : 1,
		"work_id" : 17,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5f9fd938-74f6-45a2-aaa1-61da011e7f31"
	},
	{
		"work_worker_id" : 83,
		"factory_id" : 1,
		"work_id" : 17,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8240954b-bffe-4f3c-bc39-310ad114eaca"
	},
	{
		"work_worker_id" : 84,
		"factory_id" : 1,
		"work_id" : 17,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9d73762a-d4bb-41a7-8267-c49fee742ca6"
	},
	{
		"work_worker_id" : 85,
		"factory_id" : 1,
		"work_id" : 17,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "85085f48-14af-4080-89fa-0398d93e961d"
	},
	{
		"work_worker_id" : 86,
		"factory_id" : 1,
		"work_id" : 18,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d8140755-854c-4b56-9b6b-81d8965fdfe7"
	},
	{
		"work_worker_id" : 87,
		"factory_id" : 1,
		"work_id" : 18,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "684cc2af-a723-4052-a12f-507e2bdf9764"
	},
	{
		"work_worker_id" : 88,
		"factory_id" : 1,
		"work_id" : 18,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9efecf80-6683-4c21-955f-20d9eff8113a"
	},
	{
		"work_worker_id" : 89,
		"factory_id" : 1,
		"work_id" : 18,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b5616a24-6ed2-4a4f-97e4-6c5af2e0bd8e"
	},
	{
		"work_worker_id" : 90,
		"factory_id" : 1,
		"work_id" : 18,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "280a879b-4518-4e92-b8f8-844008b53d5e"
	},
	{
		"work_worker_id" : 91,
		"factory_id" : 1,
		"work_id" : 19,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3f96e81f-668b-4ddb-bb03-73d2e9f44699"
	},
	{
		"work_worker_id" : 92,
		"factory_id" : 1,
		"work_id" : 19,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "21640655-baa1-4dd6-a973-1f7d95820346"
	},
	{
		"work_worker_id" : 93,
		"factory_id" : 1,
		"work_id" : 19,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "54283f20-e5b5-45b7-93b0-f87c877cf33e"
	},
	{
		"work_worker_id" : 94,
		"factory_id" : 1,
		"work_id" : 19,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a61e5570-b980-4a44-87be-971cbc746461"
	},
	{
		"work_worker_id" : 95,
		"factory_id" : 1,
		"work_id" : 19,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "603d5cb7-0043-4d62-a33c-3e7e3934c1b8"
	},
	{
		"work_worker_id" : 96,
		"factory_id" : 1,
		"work_id" : 20,
		"emp_id" : 1,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2d2fa67d-ae17-45fe-af3a-439875104306"
	},
	{
		"work_worker_id" : 97,
		"factory_id" : 1,
		"work_id" : 20,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "55c8d276-57a9-4974-8e39-4f47fadd227a"
	},
	{
		"work_worker_id" : 98,
		"factory_id" : 1,
		"work_id" : 20,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "23c47741-f15d-43e5-b304-0ba249569885"
	},
	{
		"work_worker_id" : 99,
		"factory_id" : 1,
		"work_id" : 20,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ee0ea724-5cbd-4b79-b779-deddb404b96a"
	},
	{
		"work_worker_id" : 100,
		"factory_id" : 1,
		"work_id" : 20,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "57f06cb7-2015-46a3-a7dc-2fbf172d217c"
	},
	{
		"work_worker_id" : 101,
		"factory_id" : 1,
		"work_id" : 21,
		"emp_id" : 1,
		"start_date" : moment("2021-02-02T11:20:00.000Z").toString(),
		"end_date" : moment("2021-03-02T17:30:00.000Z").toString(),
		"work_time" : 40690.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cb97f2a7-a4c9-418d-bfb2-6fd7682f2452"
	},
	{
		"work_worker_id" : 102,
		"factory_id" : 1,
		"work_id" : 21,
		"emp_id" : 2,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7c96ce82-6ce3-4840-83e0-ce98cebab1b2"
	},
	{
		"work_worker_id" : 103,
		"factory_id" : 1,
		"work_id" : 21,
		"emp_id" : 3,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "180afede-09d1-45ca-bae7-db1482632ed3"
	},
	{
		"work_worker_id" : 104,
		"factory_id" : 1,
		"work_id" : 21,
		"emp_id" : 4,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "18ac731e-1829-43ff-be85-55b2aafbdbb2"
	},
	{
		"work_worker_id" : 105,
		"factory_id" : 1,
		"work_id" : 21,
		"emp_id" : 5,
		"start_date" : null,
		"end_date" : null,
		"work_time" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d4fff618-ecd9-426e-9277-d7cf86d8713b"
	}
];

const baseMigration = new BaseMigration('PrdWorkWorker', 'work_worker_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };