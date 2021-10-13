import IStdWorkerGroupWorker from '../../interfaces/std/worker-group-worker.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdWorkerGroupWorker[] = [
];

const baseMigration = new BaseMigration('StdWorkerGroupWorker', 'worker_group_worker_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };