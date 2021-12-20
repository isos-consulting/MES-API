import IAutUserPermission from '../../interfaces/aut/user-permission.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IAutUserPermission[] = [
];

const baseMigration = new BaseMigration('AutUserPermission', 'user_permission_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };