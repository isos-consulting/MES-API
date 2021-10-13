import ISalOrder from '../../interfaces/sal/order.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: ISalOrder[] = [
];

const baseMigration = new BaseMigration('SalOrder', 'order_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };