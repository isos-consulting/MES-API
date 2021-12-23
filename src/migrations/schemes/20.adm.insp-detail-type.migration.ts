import IAdmInspDetailType from '../../interfaces/adm/insp-detail-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmInspDetailType[] = [
	{
		insp_detail_type_id : 1,
		insp_detail_type_cd : "SELF_PROC",
		insp_detail_type_nm : "자주검사",
		insp_type_id : 2,
		worker_fg : true,
		inspector_fg : false,
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "55adc877-30b5-4524-8f50-53dee55bcb8b"
	},
	{
		insp_detail_type_id : 2,
		insp_detail_type_cd : "PATROL_PROC",
		insp_detail_type_nm : "순회검사",
		insp_type_id : 2,
		worker_fg : false,
		inspector_fg : true,
		sortby : 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "fdc4d803-1a40-46be-8291-d7511a9bc838"
	},
	{
		insp_detail_type_id : 3,
		insp_detail_type_cd : "MAT_RECEIVE",
		insp_detail_type_nm : "자재수입검사",
		insp_type_id : 1,
		worker_fg : false,
		inspector_fg : true,
		sortby : 3,
		created_uid : 1,
		updated_uid : 1,
		uuid : "cfe4ab6d-4f2c-4c09-9d5a-026c08b2f6b4"
	},
	{
		insp_detail_type_id : 4,
		insp_detail_type_cd : "OUT_RECEIVE",
		insp_detail_type_nm : "외주수입검사",
		insp_type_id : 1,
		worker_fg : false,
		inspector_fg : true,
		sortby : 4,
		created_uid : 1,
		updated_uid : 1,
		uuid : "522fa440-8204-4b38-9843-29b6ad71dcf3"
	},
	{
		insp_detail_type_id : 5,
		insp_detail_type_cd : "FINAL_INSP",
		insp_detail_type_nm : "최종검사",
		insp_type_id : 3,
		worker_fg : false,
		inspector_fg : true,
		sortby : 5,
		created_uid : 1,
		updated_uid : 1,
		uuid : "adb5ad85-12d0-40d2-95f1-5cebfd9463eb"
	}
]
const baseMigration = new BaseMigration('AdmInspDetailType', 'insp_detail_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };