import IStdWorkerGroup from '../../interfaces/std/worker-group.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdWorkerGroup[] = [
  {
		"worker_group_id" : 1,
		"factory_id" : 1,
		"worker_group_cd" : "001",
		"worker_group_nm" : "작업1팀",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "396a17d1-2a2b-44bc-8e29-beb5ff1bd00a"
	},
	{
		"worker_group_id" : 2,
		"factory_id" : 1,
		"worker_group_cd" : "002",
		"worker_group_nm" : "작업2팀",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cd65601e-d75d-4663-b40a-5a8be3865f0b"
	},
	{
		"worker_group_id" : 3,
		"factory_id" : 1,
		"worker_group_cd" : "003",
		"worker_group_nm" : "작업3팀",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e3b10074-e82d-466b-bb79-5291e5018c00"
	}
]

const baseMigration = new BaseMigration('StdWorkerGroup', 'worker_group_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };