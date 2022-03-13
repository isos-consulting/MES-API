import IAdmInspType from '../../interfaces/adm/insp-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmInspType[] = [
	{
		insp_type_id : 1,
		insp_type_cd : "RECEIVE_INSP",
		insp_type_nm : "수입검사",
		worker_fg : false,
		inspector_fg : true,
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "a2b69dd8-f946-4444-b734-5b081c34dcdc"
	},
	{
		insp_type_id : 2,
		insp_type_cd : "PROC_INSP",
		insp_type_nm : "공정검사",
		worker_fg : true,
		inspector_fg : true,
		sortby : 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "c165c1c7-a4d6-466e-8a76-badad9fc2efd"
	},
	{
		insp_type_id : 3,
		insp_type_cd : "FINAL_INSP",
		insp_type_nm : "최종검사",
		worker_fg : false,
		inspector_fg : true,
		sortby : 3,
		created_uid : 1,
		updated_uid : 1,
		uuid : "87db4570-e9d5-4d94-a9f0-2bffc8925a91"
	}
]

const baseMigration = new BaseMigration('AdmInspType', 'insp_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };