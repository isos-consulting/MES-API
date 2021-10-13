import IPrdWorkRouting from '../../interfaces/prd/work-routing.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdWorkRouting[] = [
];

const baseMigration = new BaseMigration('PrdWorkRouting', 'work_routing_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };