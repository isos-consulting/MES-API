import IStdWorkings from '../../interfaces/std/workings.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdWorkings[] = [
  
]

const baseMigration = new BaseMigration('StdWorkings', 'workings_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };