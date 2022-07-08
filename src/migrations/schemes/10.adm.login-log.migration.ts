import IAdmLoginLog from '../../interfaces/adm/login-log.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmLoginLog[] = [

]

const baseMigration = new BaseMigration('AdmLoginLog', 'log_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };3

