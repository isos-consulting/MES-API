import IAdmFileMgmtType from '../../interfaces/adm/file-mgmt-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmFileMgmtType[] = [
]

const baseMigration = new BaseMigration('AdmFileMgmtType', 'file_mgmt_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };