import IAdmUseLog from '../../interfaces/adm/use-log.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmUseLog[] = [

]

const baseMigration = new BaseMigration('AdmUseLog', 'log_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };3

