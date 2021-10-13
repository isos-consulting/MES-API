import IPrdWorkWorker from '../../interfaces/prd/work-worker.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdWorkWorker[] = [
];

const baseMigration = new BaseMigration('PrdWorkWorker', 'work_worker_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };