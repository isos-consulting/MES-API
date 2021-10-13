import IPrdDemand from '../../interfaces/prd/demand.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdDemand[] = [
];

const baseMigration = new BaseMigration('PrdDemand', 'demand_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };