import IMatIncome from '../../interfaces/mat/income.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IMatIncome[] = [
]

const baseMigration = new BaseMigration('MatIncome', 'income_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };