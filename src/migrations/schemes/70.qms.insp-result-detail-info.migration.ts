import IQmsInspResultDetailInfo from '../../interfaces/qms/insp-result-detail-info.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IQmsInspResultDetailInfo[] = [
];

const baseMigration = new BaseMigration('QmsInspResultDetailInfo', 'insp_result_detail_info_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };