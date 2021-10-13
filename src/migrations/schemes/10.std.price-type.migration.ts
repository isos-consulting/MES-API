import IStdPriceType from '../../interfaces/std/price-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdPriceType[] = [
]

const baseMigration = new BaseMigration('StdPriceType', 'price_type_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };