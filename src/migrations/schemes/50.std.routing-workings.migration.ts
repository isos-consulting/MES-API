import IStdRoutingWorkings from '../../interfaces/std/routing-workings.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdRoutingWorkings[] = [
	
]

const baseMigration = new BaseMigration('StdRoutingWorkings', 'routing_workings_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };