import IStdWorker from '../../interfaces/std/worker.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdWorker[] = [
	
]

const baseMigration = new BaseMigration('StdWorker', 'worker_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };