import IOutIncome from '../../interfaces/out/income.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IOutIncome[] = [
]

const baseMigration = new BaseMigration('OutIncome', 'income_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };