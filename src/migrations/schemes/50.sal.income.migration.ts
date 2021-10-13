import ISalIncome from '../../interfaces/sal/income.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: ISalIncome[] = [
];

const baseMigration = new BaseMigration('SalIncome', 'income_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };