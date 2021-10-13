import ISalOrderDetail from '../../interfaces/sal/order-detail.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: ISalOrderDetail[] = [
];

const baseMigration = new BaseMigration('SalOrderDetail', 'order_detail_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };