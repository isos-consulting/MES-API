import IStdSupplier from '../../interfaces/std/supplier.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdSupplier[] = [
  
]

const baseMigration = new BaseMigration('StdSupplier', 'supplier_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };