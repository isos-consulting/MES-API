import IAdmBomInputType from '../../interfaces/adm/bom-input-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmBomInputType[] = [
	{
		bom_input_type_id : 1,
		bom_input_type_cd : "PUSH",
		bom_input_type_nm : "수동입력",
		sortby : 1,
		created_uid : 1,
		updated_uid : 1
	},
	{
		bom_input_type_id : 2,
		bom_input_type_cd : "PULL",
		bom_input_type_nm : "선입선출",
		sortby : 2,
		created_uid : 1,
		updated_uid : 1
	}
]

const baseMigration = new BaseMigration('AdmBomInputType', 'bom_input_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };