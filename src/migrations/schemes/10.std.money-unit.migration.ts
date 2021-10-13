import IStdMoneyUnit from '../../interfaces/std/money-unit.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdMoneyUnit[] = [
]

const baseMigration = new BaseMigration('StdMoneyUnit', 'money_unit_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };