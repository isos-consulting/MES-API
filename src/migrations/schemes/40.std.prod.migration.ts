import IStdProd from '../../interfaces/std/prod.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdProd[] = [
	
]

const baseMigration = new BaseMigration('StdProd', 'prod_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };