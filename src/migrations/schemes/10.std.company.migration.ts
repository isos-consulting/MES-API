import IStdCompany from '../../interfaces/std/company.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdCompany[] = [
]

const baseMigration = new BaseMigration('StdCompany', 'company_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };