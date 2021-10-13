import IInvStore from '../../interfaces/inv/store.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IInvStore[] = [
]

const baseMigration = new BaseMigration('InvStore', undefined, process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };