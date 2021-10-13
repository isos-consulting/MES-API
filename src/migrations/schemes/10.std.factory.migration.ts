import IStdFactory from '../../interfaces/std/factory.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdFactory[] = [
  {
    factory_id: 1,
    factory_cd: 'fac_01',
    factory_nm: '1공장',
    created_uid: 1,
    updated_uid: 1,
  },
]

const baseMigration = new BaseMigration('StdFactory', 'factory_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : [{ factory_cd: 'HQ', factory_nm: '본사', created_uid: 1, updated_uid: 1 }]);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };