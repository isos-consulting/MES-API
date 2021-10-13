import IStdDept from '../../interfaces/std/dept.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdDept[] = [
  
]

const baseMigration = new BaseMigration('StdDept', 'dept_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };