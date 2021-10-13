import IStdEmp from '../../interfaces/std/emp.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdEmp[] = [
  
]

const baseMigration = new BaseMigration('StdEmp', 'emp_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };