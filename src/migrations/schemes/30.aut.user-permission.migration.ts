import IAutUserPermission from '../../interfaces/aut/user-permission.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAutUserPermission[] = [
];

const baseMigration = new BaseMigration('AutUserPermission', 'user_permission_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };