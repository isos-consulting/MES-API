import IAutPermission from '../../interfaces/aut/permission.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAutPermission[] = [
];

const baseMigration = new BaseMigration('AutPermission', 'permission_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };