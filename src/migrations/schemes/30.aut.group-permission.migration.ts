import IAutGroupPermission from '../../interfaces/aut/group-permission.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IAutGroupPermission[] = [
];

const baseMigration = new BaseMigration('AutGroupPermission', 'group_permission_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };