import IAdmStoreType from '../../interfaces/adm/store-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmStoreType[] = [
	{
		store_type_id : 1,
		store_type_cd : "available",
		store_type_nm : "가용창고",
		parameter_nm : "available",
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "c36fb66a-df80-4e93-bdc9-f9a7b6fcc9ca"
	},
	{
		store_type_id : 2,
		store_type_cd : "finalInsp",
		store_type_nm : "최종검사창고",
		parameter_nm : "finalInsp",
		sortby : 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "4272205c-953e-4ee1-8f3e-61d577f0256c"
	},
	{
		store_type_id : 3,
		store_type_cd : "outgo",
		store_type_nm : "출하창고",
		parameter_nm : "outgo",
		sortby : 3,
		created_uid : 1,
		updated_uid : 1,
		uuid : "df357267-c8a5-4637-b5c9-88d003d3ab80"
	},
	{
		store_type_id : 4,
		store_type_cd : "reject",
		store_type_nm : "부적합창고",
		parameter_nm : "reject",
		sortby : 4,
		created_uid : 1,
		updated_uid : 1,
		uuid : "d73ae5b5-e509-4dc4-a918-662edaf4ed30"
	},
	{
		store_type_id : 5,
		store_type_cd : "return",
		store_type_nm : "반출창고",
		parameter_nm : "return",
		sortby : 5,
		created_uid : 1,
		updated_uid : 1,
		uuid : "7fb91634-6e8c-49ed-8c4d-1f4a5fcab790"
	},
	{
		store_type_id : 6,
		store_type_cd : "outsourcing",
		store_type_nm : "외주창고",
		parameter_nm : "outsourcing",
		sortby : 6,
		created_uid : 1,
		updated_uid : 1,
		uuid : "58951510-b1a6-4286-a47d-a78405c3718b"
	}
]

const baseMigration = new BaseMigration('AdmStoreType', 'store_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };