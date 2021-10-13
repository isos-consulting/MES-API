import IQmsRework from '../../interfaces/qms/rework.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IQmsRework[] = [
];

const baseMigration = new BaseMigration('QmsRework', 'rework_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };