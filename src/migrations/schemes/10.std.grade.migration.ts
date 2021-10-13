import IStdGrade from '../../interfaces/std/grade.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdGrade[] = [

]

const baseMigration = new BaseMigration('StdGrade', 'grade_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };