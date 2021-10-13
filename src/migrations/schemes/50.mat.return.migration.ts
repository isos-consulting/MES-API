import IMatReturn from '../../interfaces/mat/return.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IMatReturn[] = [
]

const baseMigration = new BaseMigration('MatReturn', 'return_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };