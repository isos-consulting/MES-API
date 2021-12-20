import IAutPermission from '../../interfaces/aut/permission.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IAutPermission[] = [
];

const baseMigration = new BaseMigration('AutPermission', 'permission_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };