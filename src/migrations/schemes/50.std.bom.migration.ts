import IStdBom from '../../interfaces/std/bom.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdBom[] = [
	
]

const baseMigration = new BaseMigration('StdBom', 'bom_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };