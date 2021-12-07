import IAdmFileMgmt from '../../interfaces/adm/file-mgmt.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IAdmFileMgmt[] = [
]

const baseMigration = new BaseMigration('AdmFileMgmt', 'file_mgmt_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };