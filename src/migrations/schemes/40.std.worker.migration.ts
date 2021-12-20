import IStdWorker from '../../interfaces/std/worker.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdWorker[] = [
	{
		"worker_id" : 1,
		"factory_id" : 1,
		"proc_id" : 1,
		"workings_id" : 1,
		"emp_id" : 8,
		"worker_cd" : "001",
		"worker_nm" : "쇼트라인1_책임자",
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fcccd7a5-63ae-4622-8f2a-cf8aa72eb6a5"
	},
	{
		"worker_id" : 2,
		"factory_id" : 1,
		"proc_id" : 1,
		"workings_id" : 2,
		"emp_id" : 4,
		"worker_cd" : "002",
		"worker_nm" : "쇼트라인2_책임자",
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "da640b84-81f1-45ab-9a26-e0239c661df9"
	},
	{
		"worker_id" : 3,
		"factory_id" : 1,
		"proc_id" : 2,
		"workings_id" : 3,
		"emp_id" : 3,
		"worker_cd" : "003",
		"worker_nm" : "수동조립1_책임자",
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1ec43b46-0970-4ef1-8d43-5c83a9d574bc"
	},
	{
		"worker_id" : 4,
		"factory_id" : 1,
		"proc_id" : 2,
		"workings_id" : 4,
		"emp_id" : 5,
		"worker_cd" : "004",
		"worker_nm" : "수동조립2_책임자",
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bd29a81e-a72b-4da5-8734-f0953308a9cd"
	},
	{
		"worker_id" : 5,
		"factory_id" : 1,
		"proc_id" : 1,
		"workings_id" : 1,
		"emp_id" : 9,
		"worker_cd" : "005",
		"worker_nm" : "쇼트라인2_근무자",
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "529c572c-1380-414b-9e3b-78d6d786db9f"
	}
]

const baseMigration = new BaseMigration('StdWorker', 'worker_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };