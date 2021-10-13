import IStdRejectType from '../../interfaces/std/reject-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdRejectType[] = [
  
]

const baseMigration = new BaseMigration('StdRejectType', 'reject_type_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };