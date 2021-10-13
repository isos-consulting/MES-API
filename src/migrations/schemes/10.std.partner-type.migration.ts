import IStdPartnerType from '../../interfaces/std/partner-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdPartnerType[] = [
]

const baseMigration = new BaseMigration('StdPartnerType', 'partner_type_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };