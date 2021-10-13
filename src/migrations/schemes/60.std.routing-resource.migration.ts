import IStdRoutingResource from '../../interfaces/std/routing-resource.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdRoutingResource[] = [
  
]

const baseMigration = new BaseMigration('StdRoutingResource', 'routing_resource_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };