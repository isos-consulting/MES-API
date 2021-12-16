import IAdmFileMgmtType from '../../interfaces/adm/file-mgmt-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmFileMgmtType[] = [
	{
		file_mgmt_type_id : 1,
		file_mgmt_type_cd : "FIL_ADM_FILES",
		file_mgmt_type_nm : "MES 기본 다운로드 파일( 저장경로 -> Update 파일 올리는 경로와 동일 )",
		table_nm : "",
		id_nm : "",
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "cfcfb6e9-945a-427b-a383-332c748009d5"
	},
	{
		file_mgmt_type_id : 2,
		file_mgmt_type_cd : "FIL_STD_PROD",
		file_mgmt_type_nm : "품목관리 첨부",
		table_nm : "STD_PROD_TB",
		id_nm : "prod_id",
		sortby : 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "66519f3d-63ec-445a-bde0-87f49b223242"
	},
	{
		file_mgmt_type_id : 3,
		file_mgmt_type_cd : "IMG_QMS_INSP_STD",
		file_mgmt_type_nm : "검사기준서 이미지",
		table_nm : "QMS_INSP_TB",
		id_nm : "insp_id",
		sortby : 3,
		created_uid : 1,
		updated_uid : 1,
		uuid : "6717a68c-3d58-40cf-a77f-538cff4d91e6"
	}
]

const baseMigration = new BaseMigration('AdmFileMgmtType', 'file_mgmt_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };