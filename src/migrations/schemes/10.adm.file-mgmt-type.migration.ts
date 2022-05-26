import IAdmFileMgmtType from '../../interfaces/adm/file-mgmt-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmFileMgmtType[] = [
	{
		file_mgmt_type_id : 1,
		file_mgmt_type_cd : "FIL_ADM_FILES",
		file_mgmt_type_nm : "MES 기본 다운로드 파일( 저장경로 -> Update 파일 올리는 경로와 동일 )",
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "cfcfb6e9-945a-427b-a383-332c748009d5"
	},
	{
		file_mgmt_type_id : 5,
		file_mgmt_type_cd : "FIL_STD_PROD",
		file_mgmt_type_nm : "품목관리 첨부",
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "d3d25d0d-73cc-46bd-a679-b6952631f992"
	},
	{
		file_mgmt_type_id : 6,
		file_mgmt_type_cd : "FIL_STD_EMP",
		file_mgmt_type_nm : "사원관리 첨부",
		sortby : 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "c9294cad-6560-4b54-9ece-65000123cec0"
	},
	{
		file_mgmt_type_id : 7,
		file_mgmt_type_cd : "FIL_STD_EQUIP",
		file_mgmt_type_nm : "설비관리 첨부",
		sortby : 3,
		created_uid : 1,
		updated_uid : 1,
		uuid : "2dd158bf-8a3c-4871-8f6d-e2155ac23a22"
	},
	{
		file_mgmt_type_id : 8,
		file_mgmt_type_cd : "FIL_QMS_INSP",
		file_mgmt_type_nm : "검사기준서 첨부",
		sortby : 4,
		created_uid : 1,
		updated_uid : 1,
		uuid : "e002dec5-ad93-44c8-9d4e-135f14e41804"
	}
]

const baseMigration = new BaseMigration('AdmFileMgmtType', 'file_mgmt_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };