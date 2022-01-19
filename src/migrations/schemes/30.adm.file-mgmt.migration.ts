import IAdmFileMgmt from '../../interfaces/adm/file-mgmt.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmFileMgmt[] = [
]

const baseMigration = new BaseMigration('AdmFileMgmt', 'file_mgmt_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };