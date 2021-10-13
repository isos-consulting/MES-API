import IPrdReturn from '../../interfaces/prd/return.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdReturn[] = [
];

const baseMigration = new BaseMigration('PrdReturn', 'return_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };