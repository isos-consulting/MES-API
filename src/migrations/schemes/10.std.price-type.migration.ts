import IStdPriceType from '../../interfaces/std/price-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdPriceType[] = [
  {
		"price_type_id" : 1,
		"price_type_cd" : "001",
		"price_type_nm" : "정단가",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5e298eff-dfdf-42f2-9081-24ba6f3a69dc"
	},
	{
		"price_type_id" : 2,
		"price_type_cd" : "002",
		"price_type_nm" : "가단가",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b43897e9-473f-4a59-9a15-c4218a4b9b2c"
	}
]

const baseMigration = new BaseMigration('StdPriceType', 'price_type_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };