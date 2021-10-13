import IQmsInsp from '../../interfaces/qms/insp.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IQmsInsp[] = [
];

const baseMigration = new BaseMigration('QmsInsp', 'insp_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };