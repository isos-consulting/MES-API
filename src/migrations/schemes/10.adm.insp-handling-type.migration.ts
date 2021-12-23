import IAdmInspHandlingType from '../../interfaces/adm/insp-handling-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmInspHandlingType[] = [
	{
		insp_handling_type_id : 1,
		insp_handling_type_cd : "INCOME",
		insp_handling_type_nm : "입고",
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "c80bb28e-c6a5-43a2-b23e-df1636c85554"
	},
	{
		insp_handling_type_id : 2,
		insp_handling_type_cd : "RETURN",
		insp_handling_type_nm : "반출",
		sortby : 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "959a623b-78f7-4bf1-a3b0-513084185803"
	},
	{
		insp_handling_type_id : 3,
		insp_handling_type_cd : "SELECTION",
		insp_handling_type_nm : "선별",
		sortby : 3,
		created_uid : 1,
		updated_uid : 1,
		uuid : "1da66c75-fed0-4ee5-ab10-e84ce1340125"
	}
]

const baseMigration = new BaseMigration('AdmInspHandlingType', 'insp_handling_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };