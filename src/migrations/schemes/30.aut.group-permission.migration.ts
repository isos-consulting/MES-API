import IAutGroupPermission from '../../interfaces/aut/group-permission.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAutGroupPermission[] = [
];

const baseMigration = new BaseMigration('AutGroupPermission', 'group_permission_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };