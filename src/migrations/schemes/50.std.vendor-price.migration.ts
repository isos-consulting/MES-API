import IStdVendorPrice from '../../interfaces/std/vendor-price.interface';
import BaseMigration from '../base-migration';

const seedDatas: IStdVendorPrice[] = [
  
]

const baseMigration = new BaseMigration('StdVendorPrice', 'vendor_price_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };