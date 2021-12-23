import IAdmBomType from '../../interfaces/adm/bom-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmBomType[] = [
	{
		bom_type_id : 1,
		bom_type_cd : "BUY",
		bom_type_nm : "BUY",
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "771d2fc8-e8f4-486d-bd34-cf9615b03eba"
	},
	{
		bom_type_id : 2,
		bom_type_cd : "MAKE",
		bom_type_nm : "MAKE",
		sortby : 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "854e98d8-511d-433b-84b8-618cf2c24d87"
	},
	{
		bom_type_id : 3,
		bom_type_cd : "PHANTOM",
		bom_type_nm : "PHANTOM",
		sortby : 3,
		created_uid : 1,
		updated_uid : 1,
		uuid : "8c7ece5e-6c95-4250-b841-56f5b01abcfd"
	}
]

const baseMigration = new BaseMigration('AdmBomType', 'bom_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };