import IQmsInspDetail from '../../interfaces/qms/insp-detail.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IQmsInspDetail[] = [
];

const baseMigration = new BaseMigration('QmsInspDetail', 'insp_detail_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };