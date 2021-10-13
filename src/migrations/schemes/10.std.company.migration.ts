import IStdCompany from '../../interfaces/std/company.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdCompany[] = [
]

const baseMigration = new BaseMigration('StdCompany', 'company_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };