import IMatOrderDetail from '../../interfaces/mat/order-detail.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IMatOrderDetail[] = [
]

const baseMigration = new BaseMigration('MatOrderDetail', 'order_detail_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };