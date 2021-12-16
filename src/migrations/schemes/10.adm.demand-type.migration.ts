import IAdmDemandType from '../../interfaces/adm/demand-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmDemandType[] = [
	{
		demand_type_id : 1,
		demand_type_cd : "PD",
		demand_type_nm : "생산출고요청",
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "2b40be02-d8d3-4deb-a0a0-2a1549ed80b5"
	},
	{
		demand_type_id : 2,
		demand_type_cd : "SD",
		demand_type_nm : "샘플출고요청",
		sortby : 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "76585e39-195b-46bf-89fd-edb8d3e2329b"
	}
]

const baseMigration = new BaseMigration('AdmDemandType', 'demand_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };