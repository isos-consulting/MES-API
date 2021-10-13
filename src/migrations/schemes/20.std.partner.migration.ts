import IStdPartner from '../../interfaces/std/partner.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdPartner[] = [
  
]

const baseMigration = new BaseMigration('StdPartner', 'partner_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };