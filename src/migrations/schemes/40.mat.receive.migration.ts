import IMatReceive from '../../interfaces/mat/receive.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IMatReceive[] = [
]

const baseMigration = new BaseMigration('MatReceive', 'receive_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };