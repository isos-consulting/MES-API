import IPrdOrderInput from '../../interfaces/prd/order-input.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdOrderInput[] = [
];

const baseMigration = new BaseMigration('PrdOrderInput', 'order_input_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };