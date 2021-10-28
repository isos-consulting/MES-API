import IStdFactory from '../../interfaces/std/factory.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdFactory[] = [
  {
    factory_id: 1,
    factory_cd: 'HQ',
    factory_nm: '본사',
    created_uid: 1,
    updated_uid: 1,
    uuid: 'abab3ddf-2113-4bbc-9a82-f796ff790e02'
  },
]

const baseMigration = new BaseMigration('StdFactory', 'factory_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };