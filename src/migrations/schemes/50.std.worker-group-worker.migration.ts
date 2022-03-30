import IStdWorkerGroupEmp from '../../interfaces/std/worker-group-emp.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IStdWorkerGroupEmp[] = [
  {
		"worker_group_emp_id" : 1,
		"worker_group_id" : 1,
		"emp_id" : 1,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9cf1f0af-419d-4aaa-b855-dcc4e9b923b9"
	},
	{
		"worker_group_emp_id" : 2,
		"worker_group_id" : 1,
		"emp_id" : 2,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "25cc6674-290c-4e94-991a-d4f8af203562"
	},
	{
		"worker_group_emp_id" : 3,
		"worker_group_id" : 1,
		"emp_id" : 3,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c29a1e3d-d874-483f-9a21-7ec11883b25b"
	},
	{
		"worker_group_emp_id" : 4,
		"worker_group_id" : 2,
		"emp_id" : 1,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a53fbe9e-7e6a-4d5a-812d-bbcd809bc904"
	},
	{
		"worker_group_emp_id" : 5,
		"worker_group_id" : 2,
		"emp_id" : 2,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8fa40ebe-33f4-4a4b-a49e-2d608f46bc49"
	},
	{
		"worker_group_emp_id" : 6,
		"worker_group_id" : 2,
		"emp_id" : 3,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "dddab4b8-75cc-4394-8a04-d2de76d67eb7"
	},
	{
		"worker_group_emp_id" : 7,
		"worker_group_id" : 2,
		"emp_id" : 4,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ef3a12d9-252b-44d5-9c87-e0f9a16ce019"
	},
	{
		"worker_group_emp_id" : 8,
		"worker_group_id" : 2,
		"emp_id" : 5,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9866a8ee-8e67-41e7-8988-f89f57433245"
	},
	{
		"worker_group_emp_id" : 9,
		"worker_group_id" : 3,
		"emp_id" : 5,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "228aef8e-e78f-452e-9386-704287d44d1f"
	},
	{
		"worker_group_emp_id" : 10,
		"worker_group_id" : 3,
		"emp_id" : 4,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a79ae598-bc67-4561-b4c7-37ef2fdc9d47"
	},
	{
		"worker_group_emp_id" : 11,
		"worker_group_id" : 3,
		"emp_id" : 3,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6291f68e-f0f9-46a6-88da-e2644937bcf6"
	},
	{
		"worker_group_emp_id" : 12,
		"worker_group_id" : 3,
		"emp_id" : 2,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "530f0b2f-6722-4bce-a5c5-14f005f0e70a"
	},
	{
		"worker_group_emp_id" : 13,
		"worker_group_id" : 3,
		"emp_id" : 1,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2dcfe175-c4e4-4bc8-a5d7-f96a9a4d5847"
	},
	{
		"worker_group_emp_id" : 14,
		"worker_group_id" : 1,
		"emp_id" : 5,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6aaf5d5f-6cdc-4197-a738-8707a4425d64"
	},
	{
		"worker_group_emp_id" : 15,
		"worker_group_id" : 1,
		"emp_id" : 4,
		"factory_id" : 1,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "dee35b6d-a2c2-4e6c-9fe0-8e467f739f98"
	}
];

const baseMigration = new BaseMigration('StdWorkerGroupEmp', 'worker_group_emp_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };