import IStdRouting from '../../interfaces/std/routing.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdRouting[] = [
	{
		"routing_id" : 1,
		"factory_id" : 1,
		"prod_id" : 1,
		"proc_id" : 3,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ab7b13b3-17cf-4cbe-8a42-93e32f07d617"
	},
	{
		"routing_id" : 2,
		"factory_id" : 1,
		"prod_id" : 1,
		"proc_id" : 4,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "62054bcf-5417-4aa6-8b69-6885a8203e25"
	},
	{
		"routing_id" : 3,
		"factory_id" : 1,
		"prod_id" : 2,
		"proc_id" : 2,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4f134398-31ce-4501-9583-a983dd348ada"
	},
	{
		"routing_id" : 4,
		"factory_id" : 1,
		"prod_id" : 2,
		"proc_id" : 3,
		"proc_no" : 30,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c04ed76e-cc58-4cb5-a263-913e0aa80588"
	},
	{
		"routing_id" : 5,
		"factory_id" : 1,
		"prod_id" : 3,
		"proc_id" : 2,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0d33673f-931f-4a17-8ede-f9bc478ec4b8"
	},
	{
		"routing_id" : 6,
		"factory_id" : 1,
		"prod_id" : 3,
		"proc_id" : 3,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bc205b60-8a76-4536-b1f6-34213971d3ce"
	},
	{
		"routing_id" : 7,
		"factory_id" : 1,
		"prod_id" : 4,
		"proc_id" : 1,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9194b1c4-aa69-4b2f-add4-04fdf7650ab3"
	},
	{
		"routing_id" : 8,
		"factory_id" : 1,
		"prod_id" : 5,
		"proc_id" : 1,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "848d1400-a321-4d47-b91b-a05ea949d8b7"
	},
	{
		"routing_id" : 9,
		"factory_id" : 1,
		"prod_id" : 5,
		"proc_id" : 3,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6c9647f4-2cce-4aeb-9daa-17589cb91591"
	},
	{
		"routing_id" : 10,
		"factory_id" : 1,
		"prod_id" : 8,
		"proc_id" : 2,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2d742cc9-056c-42bd-9682-5789459bde13"
	},
	{
		"routing_id" : 11,
		"factory_id" : 1,
		"prod_id" : 8,
		"proc_id" : 5,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "78d2e4a8-4009-43f8-af42-96240c345e40"
	},
	{
		"routing_id" : 12,
		"factory_id" : 1,
		"prod_id" : 9,
		"proc_id" : 2,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "75723fbc-23dc-4e92-a241-e092570c5d34"
	},
	{
		"routing_id" : 13,
		"factory_id" : 1,
		"prod_id" : 9,
		"proc_id" : 5,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3c8048de-b6cd-413b-ba55-88941bba8aa8"
	},
	{
		"routing_id" : 14,
		"factory_id" : 1,
		"prod_id" : 10,
		"proc_id" : 2,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b9782101-7d84-4a84-8351-80bc10e15b3e"
	},
	{
		"routing_id" : 15,
		"factory_id" : 1,
		"prod_id" : 10,
		"proc_id" : 5,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "30fa5dc3-6840-4068-819a-b7380f12b20d"
	},
	{
		"routing_id" : 16,
		"factory_id" : 1,
		"prod_id" : 11,
		"proc_id" : 2,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e4d580ae-7d2b-4d29-8bc5-993b37d67003"
	},
	{
		"routing_id" : 17,
		"factory_id" : 1,
		"prod_id" : 11,
		"proc_id" : 5,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9101a7ac-cf79-46c2-8b28-07b6a67d9c68"
	},
	{
		"routing_id" : 18,
		"factory_id" : 1,
		"prod_id" : 12,
		"proc_id" : 2,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5a88bee1-7f4d-42e3-b0a8-d4e2d148ac38"
	},
	{
		"routing_id" : 19,
		"factory_id" : 1,
		"prod_id" : 12,
		"proc_id" : 5,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c0fe60a8-1f87-4f0a-bff7-5e91f4596c57"
	},
	{
		"routing_id" : 20,
		"factory_id" : 1,
		"prod_id" : 13,
		"proc_id" : 2,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a7518206-f39f-4c24-a1c8-fa36cedfe5ad"
	},
	{
		"routing_id" : 21,
		"factory_id" : 1,
		"prod_id" : 13,
		"proc_id" : 5,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a76855b2-394b-4172-aaf3-dd961503a6d0"
	},
	{
		"routing_id" : 22,
		"factory_id" : 1,
		"prod_id" : 14,
		"proc_id" : 2,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d16179c4-fdaa-4bad-bea2-2d382737496f"
	},
	{
		"routing_id" : 23,
		"factory_id" : 1,
		"prod_id" : 14,
		"proc_id" : 5,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7d780ed6-701e-461b-ac85-c5396acd3a94"
	},
	{
		"routing_id" : 24,
		"factory_id" : 1,
		"prod_id" : 15,
		"proc_id" : 2,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a2866a0e-d421-47c0-b906-edd919b56837"
	},
	{
		"routing_id" : 25,
		"factory_id" : 1,
		"prod_id" : 15,
		"proc_id" : 5,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7f97ce18-34f8-4536-af2a-c798428c602b"
	},
	{
		"routing_id" : 26,
		"factory_id" : 1,
		"prod_id" : 6,
		"proc_id" : 2,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "eb3a3086-4f89-4002-85a0-9f0e8dabd0cf"
	},
	{
		"routing_id" : 27,
		"factory_id" : 1,
		"prod_id" : 7,
		"proc_id" : 1,
		"proc_no" : 10,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f44e7276-e51a-48cd-a755-3b70b9ae18ef"
	},
	{
		"routing_id" : 28,
		"factory_id" : 1,
		"prod_id" : 7,
		"proc_id" : 2,
		"proc_no" : 20,
		"auto_work_fg" : false,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a2f9fcc3-4cc6-4d55-a0ce-3a3ad2dc1691"
	}
]

const baseMigration = new BaseMigration('StdRouting', 'routing_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };