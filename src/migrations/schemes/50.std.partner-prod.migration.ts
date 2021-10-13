import IStdPartnerProd from '../../interfaces/std/partner-prod.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdPartnerProd[] = [
	
]

const baseMigration = new BaseMigration('StdPartnerProd', 'partner_prod_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };