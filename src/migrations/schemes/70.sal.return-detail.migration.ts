import ISalReturnDetail from '../../interfaces/sal/return-detail.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: ISalReturnDetail[] = [
];

const baseMigration = new BaseMigration('SalReturnDetail', 'return_detail_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };