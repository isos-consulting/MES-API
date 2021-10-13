import IPrdOrderRouting from '../../interfaces/prd/order-routing.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdOrderRouting[] = [
];

const baseMigration = new BaseMigration('PrdOrderRouting', 'order_routing_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };