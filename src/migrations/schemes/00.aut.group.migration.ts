import IAutGroup from '../../interfaces/aut/group.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAutGroup[] = [
  {
    group_id: 1,
    group_nm: '관리자 그룹',
    created_uid: 1,
    updated_uid: 1,
  },
  {
    group_id: 2,
    group_nm: '일반 그룹',
    created_uid: 1,
    updated_uid: 1,
  },
]

const baseMigration = new BaseMigration('AutGroup', 'group_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };