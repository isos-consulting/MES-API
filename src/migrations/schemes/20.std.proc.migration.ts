import IStdProc from '../../interfaces/std/proc.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdProc[] = [
  
]

const baseMigration = new BaseMigration('StdProc', 'proc_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };