import IAdmFileMgmtDetailType from '../../interfaces/adm/file-mgmt-detail-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmFileMgmtDetailType[] = [
	{
		"file_mgmt_detail_type_id" : 1,
		"file_mgmt_detail_type_cd" : "FIL_STD_PROD_IMG",
		"file_mgmt_detail_type_nm" : "품목 이미지",
		"file_mgmt_type_id" : 5,
		"file_extension_types" : ".jpg, .jpeg, .png, .bmp, .gif",
		"sortby" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "94e02aab-e007-4f8f-a049-515376b5eb92"
	},
	{
		"file_mgmt_detail_type_id" : 2,
		"file_mgmt_detail_type_cd" : "FIL_STD_EMP_IMG",
		"file_mgmt_detail_type_nm" : "사원 이미지",
		"file_mgmt_type_id" : 6,
		"file_extension_types" : ".jpg, .jpeg, .png, .bmp, .gif",
		"sortby" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "568ee811-14a3-4eb5-b7e3-238aab6e5179"
	},
	{
		"file_mgmt_detail_type_id" : 3,
		"file_mgmt_detail_type_cd" : "FIL_STD_EQUIP_IMG",
		"file_mgmt_detail_type_nm" : "설비 이미지",
		"file_mgmt_type_id" : 7,
		"file_extension_types" : ".jpg, .jpeg, .png, .bmp, .gif",
		"sortby" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "746be3e9-7296-43bf-b899-2d32a67b51b2"
	},
	{
		"file_mgmt_detail_type_id" : 4,
		"file_mgmt_detail_type_cd" : "FIL_QMS_INSP_DRAW",
		"file_mgmt_detail_type_nm" : "검사 도면",
		"file_mgmt_type_id" : 8,
		"file_extension_types" : ".jpg, .jpeg, .png, .bmp, .gif",
		"sortby" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e792e0af-db0a-46b7-a8a8-1842256972ef"
	}
]

const baseMigration = new BaseMigration('AdmFileMgmtDetailType', 'file_mgmt_detail_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };