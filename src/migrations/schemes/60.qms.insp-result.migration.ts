import IQmsInspResult from '../../interfaces/qms/insp-result.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IQmsInspResult[] = [
];

const baseMigration = new BaseMigration('QmsInspResult', 'insp_result_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };