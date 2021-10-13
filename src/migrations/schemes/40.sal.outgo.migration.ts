import ISalOutgo from '../../interfaces/sal/outgo.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: ISalOutgo[] = [
];

const baseMigration = new BaseMigration('SalOutgo', 'outgo_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };