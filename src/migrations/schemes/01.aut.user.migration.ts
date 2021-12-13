import IAutUser from '../../interfaces/aut/user.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IAutUser[] = [
  { 
    uid: 1,
    id: 'isos',
    user_nm: 'ISOS',
    pwd: '123',
    email: 'isos@isos.com',
    pwd_fg: false,
    admin_fg: true,
    super_admin_fg: true,
    created_uid: 1,
    updated_uid: 1
  },
  { 
    uid: 2,
    group_id: 1,
    id: 'admin',
    user_nm: '관리자',
    pwd: '123',
    email: 'admin@admin.com',
    pwd_fg: false,
    admin_fg: true,
    super_admin_fg: false,
    created_uid: 1,
    updated_uid: 1
  }
]

const baseMigration = new BaseMigration('AutUser', 'uid', seedDatas);

const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };