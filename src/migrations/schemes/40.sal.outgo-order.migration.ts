import ISalOutgoOrder from '../../interfaces/sal/outgo-order.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: ISalOutgoOrder[] = [
];

const baseMigration = new BaseMigration('SalOutgoOrder', 'outgo_order_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };