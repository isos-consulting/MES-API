import IInvMove from '../../interfaces/inv/move.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IInvMove[] = [
];

const baseMigration = new BaseMigration('InvMove', 'move_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };