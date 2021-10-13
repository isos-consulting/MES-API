import IPrdOrder from '../../interfaces/prd/order.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdOrder[] = [
];

const baseMigration = new BaseMigration('PrdOrder', 'order_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };