import IStdLocation from '../../interfaces/std/location.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdLocation[] = [
  
]

const baseMigration = new BaseMigration('StdLocation', 'location_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };