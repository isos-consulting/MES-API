import ISalOutgoDetail from '../../interfaces/sal/outgo-detail.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: ISalOutgoDetail[] = [
];

const baseMigration = new BaseMigration('SalOutgoDetail', 'outgo_detail_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };