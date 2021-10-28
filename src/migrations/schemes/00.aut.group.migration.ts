import IAutGroup from '../../interfaces/aut/group.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAutGroup[] = [
  {
    group_id: 1,
    group_nm: '관리자 그룹',
    created_uid: 1,
    updated_uid: 1,
    uuid: 'e160fd55-2b90-47f0-b1d1-e458d4ad11d8'
  },
  {
    group_id: 2,
    group_nm: '일반 그룹',
    created_uid: 1,
    updated_uid: 1,
    uuid: '23f09ec6-af2d-4f1d-8da3-b6a18ec63dc6'
  },
]

const baseMigration = new BaseMigration('AutGroup', 'group_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };