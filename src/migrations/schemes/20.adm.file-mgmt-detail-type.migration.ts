import IAdmFileMgmtDetailType from '../../interfaces/adm/file-mgmt-detail-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmFileMgmtDetailType[] = [
]

const baseMigration = new BaseMigration('AdmFileMgmtDetailType', 'file_mgmt_detail_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };