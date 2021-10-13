import IQmsInspResultDetailValue from '../../interfaces/qms/insp-result-detail-value.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IQmsInspResultDetailValue[] = [
];

const baseMigration = new BaseMigration('QmsInspResultDetailValue', 'insp_result_detail_value_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };