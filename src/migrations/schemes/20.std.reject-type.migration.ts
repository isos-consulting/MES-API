import IStdRejectType from '../../interfaces/std/reject-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdRejectType[] = [
  {
		"reject_type_id" : 1,
		"factory_id" : 1,
		"reject_type_cd" : "A",
		"reject_type_nm" : "가공불량",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "37a563e6-a61d-43bf-b4c2-68a7ca46b5c5"
	},
	{
		"reject_type_id" : 2,
		"factory_id" : 1,
		"reject_type_cd" : "B",
		"reject_type_nm" : "소재불량",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f6682023-5581-4e31-85af-781832063539"
	},
	{
		"reject_type_id" : 3,
		"factory_id" : 1,
		"reject_type_cd" : "C",
		"reject_type_nm" : "셋팅불량",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6cb29bac-5fb1-4cc5-9b9b-dfe5b7cf8173"
	}
]

const baseMigration = new BaseMigration('StdRejectType', 'reject_type_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };