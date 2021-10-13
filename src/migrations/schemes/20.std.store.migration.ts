import IStdStore from '../../interfaces/std/store.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdStore[] = [
  
]

const baseMigration = new BaseMigration('StdStore', 'store_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : [
  
]);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };