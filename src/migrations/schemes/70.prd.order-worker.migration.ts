import IPrdOrderWorker from '../../interfaces/prd/order-worker.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdOrderWorker[] = [
];

const baseMigration = new BaseMigration('PrdOrderWorker', 'order_worker_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };