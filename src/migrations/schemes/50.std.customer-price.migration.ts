import IStdCustomerPrice from '../../interfaces/std/customer-price.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdCustomerPrice[] = [
  
]

const baseMigration = new BaseMigration('StdCustomerPrice', 'customer_price_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };