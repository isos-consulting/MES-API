import IMldProblem from '../../interfaces/mld/problem.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IMldProblem[] = [
]

const baseMigration = new BaseMigration('MldProblem', 'problem_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };