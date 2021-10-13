import IStdWorkerGroup from '../../interfaces/std/worker-group.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdWorkerGroup[] = [
]

const baseMigration = new BaseMigration('StdWorkerGroup', 'worker_group_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };