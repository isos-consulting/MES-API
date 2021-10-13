import IStdRouting from '../../interfaces/std/routing.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdRouting[] = [
	
]

const baseMigration = new BaseMigration('StdRouting', 'routing_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };