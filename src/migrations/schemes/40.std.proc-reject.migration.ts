import IStdProcReject from '../../interfaces/std/proc-reject.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdProcReject[] = [
	{
		"proc_reject_id" : 1,
		"factory_id" : 1,
		"proc_id" : 1,
		"reject_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e5a030c0-86e1-4c29-9a4e-043a5ffe655f"
	},
	{
		"proc_reject_id" : 2,
		"factory_id" : 1,
		"proc_id" : 1,
		"reject_id" : 2,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7193d976-20b2-47f2-8da5-f956e3337814"
	},
	{
		"proc_reject_id" : 3,
		"factory_id" : 1,
		"proc_id" : 1,
		"reject_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "29981ecb-d900-4dd3-8b26-c2ab0c0266d2"
	},
	{
		"proc_reject_id" : 4,
		"factory_id" : 1,
		"proc_id" : 2,
		"reject_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "98817524-51e2-4102-bedf-214e44d16eb0"
	},
	{
		"proc_reject_id" : 5,
		"factory_id" : 1,
		"proc_id" : 2,
		"reject_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b0af40b8-fb52-4fd7-bcb5-44de7a0b8a4b"
	},
	{
		"proc_reject_id" : 6,
		"factory_id" : 1,
		"proc_id" : 3,
		"reject_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "51fea431-d989-491b-be58-7fa8c2c8a99e"
	},
	{
		"proc_reject_id" : 7,
		"factory_id" : 1,
		"proc_id" : 3,
		"reject_id" : 5,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "26ef7df4-925f-46e7-9795-976176611f25"
	},
	{
		"proc_reject_id" : 8,
		"factory_id" : 1,
		"proc_id" : 3,
		"reject_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "93bbfc4a-5b0b-4fe8-9d12-73868a3a7628"
	},
	{
		"proc_reject_id" : 9,
		"factory_id" : 1,
		"proc_id" : 4,
		"reject_id" : 2,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "dfba1518-8fe2-4321-b781-446011573a0b"
	},
	{
		"proc_reject_id" : 10,
		"factory_id" : 1,
		"proc_id" : 4,
		"reject_id" : 3,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a19db925-10cc-4e65-a9a4-487120f63afd"
	},
	{
		"proc_reject_id" : 11,
		"factory_id" : 1,
		"proc_id" : 5,
		"reject_id" : 4,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4c59ddfd-41a9-472c-830e-848166e8b393"
	},
	{
		"proc_reject_id" : 12,
		"factory_id" : 1,
		"proc_id" : 5,
		"reject_id" : 5,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "14fe4e43-450b-4751-8910-5bad61e11525"
	}
]

const baseMigration = new BaseMigration('StdProcReject', 'proc_reject_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };