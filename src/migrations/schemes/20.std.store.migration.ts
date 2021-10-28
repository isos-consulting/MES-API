import IStdStore from '../../interfaces/std/store.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdStore[] = [
  {
		"store_id" : 1,
		"factory_id" : 1,
		"store_cd" : "001",
		"store_nm" : "자재창고",
		"reject_store_fg" : false,
		"return_store_fg" : true,
		"outgo_store_fg" : false,
		"final_insp_store_fg" : false,
    "outsourcing_store_fg": false,
		"available_store_fg" : true,
    "position_type": "사내",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9af9fc43-9dd0-4f35-9c0d-f90764f04482"
	},
	{
		"store_id" : 2,
		"factory_id" : 1,
		"store_cd" : "002",
		"store_nm" : "재공창고",
		"reject_store_fg" : false,
		"return_store_fg" : true,
		"outgo_store_fg" : false,
		"final_insp_store_fg" : true,
    "outsourcing_store_fg": false,
		"available_store_fg" : true,
    "position_type": "사내",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4bf66eba-4e38-4197-8594-704dbe78e527"
	},
	{
		"store_id" : 3,
		"factory_id" : 1,
		"store_cd" : "003",
		"store_nm" : "제품창고",
		"reject_store_fg" : false,
		"return_store_fg" : true,
		"outgo_store_fg" : true,
		"final_insp_store_fg" : false,
    "outsourcing_store_fg": false,
		"available_store_fg" : true,
    "position_type": "사내",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4c27c337-3682-47fe-ba55-bbb73c03a893"
	},
	{
		"store_id" : 4,
		"factory_id" : 1,
		"store_cd" : "004",
		"store_nm" : "외주창고",
		"reject_store_fg" : false,
		"return_store_fg" : true,
		"outgo_store_fg" : true,
		"final_insp_store_fg" : true,
    "outsourcing_store_fg": true,
		"available_store_fg" : true,
    "position_type": "사외",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "de099ad6-a866-4d0f-b4fc-e1116476fbce"
	},
	{
		"store_id" : 5,
		"factory_id" : 1,
		"store_cd" : "005",
		"store_nm" : "불량창고",
		"reject_store_fg" : true,
		"return_store_fg" : false,
		"outgo_store_fg" : false,
		"final_insp_store_fg" : false,
    "outsourcing_store_fg": false,
		"available_store_fg" : false,
    "position_type": "사내",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "113d50ef-5533-473a-860d-709cf5d6fd83"
	}
]

const baseMigration = new BaseMigration('StdStore', 'store_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };