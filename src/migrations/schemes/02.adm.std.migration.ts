import IAdmStd from '../../interfaces/adm/std.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IAdmStd[] = [
  {
		std_id: 1,
		std_cd: 'company_opt',
		std_nm: '옵션',
		view_nm: 'ADM_COMPANY_OPT_VW',
		col_nm: 'company_opt',
		created_uid: 1,
		updated_uid: 1
	},
  {
		std_id: 2,
		std_cd: 'transaction',
		std_nm: '수불유형',
		view_nm: 'ADM_TRANSACTION_VW',
		col_nm: 'tran',
		created_uid: 1,
		updated_uid: 1
	},
  {
		std_id: 3,
		std_cd: 'bom_type',
		std_nm: 'BOM 구성유형',
		view_nm: 'ADM_BOM_TYPE_VW',
		col_nm: 'bom_type',
		created_uid: 1,
		updated_uid: 1
	},
  {
		std_id: 4,
		std_cd: 'insp_type',
		std_nm: '검사유형',
		view_nm: 'ADM_INSP_TYPE_VW',
		col_nm: 'insp_type',
		created_uid: 1,
		updated_uid: 1
	},
  {
		std_id: 5,
		std_cd: 'demand_type',
		std_nm: '요청',
		view_nm: 'ADM_DEMAND_TYPE_VW',
		col_nm: 'demand_type',
		created_uid: 1,
		updated_uid: 1
	},
  {
		std_id: 6,
		std_cd: 'prd_plan_type',
		std_nm: '계획구분',
		view_nm: 'ADM_PRD_PLAN_TYPE_VW',
		col_nm: 'prd_plan_type',
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_id: 7,
		std_cd: 'rework_type',
		std_nm: '재작업유형',
		view_nm: 'ADM_REWORK_TYPE_VW',
		col_nm: 'rework_type',
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_id: 8,
		std_cd: 'pattern_opt',
		std_nm: '자동번호발행 옵션',
		view_nm: 'ADM_PATTERN_OPT_VW',
		col_nm: 'pattern_opt',
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_id: 9,
		std_cd: 'insp_detail_type',
		std_nm: '세부검사유형',
		view_nm: 'ADM_INSP_DETAIL_TYPE_VW',
		col_nm: 'insp_detail_type',
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_id: 10,
		std_cd: 'store_type',
		std_nm: '창고유형',
		view_nm: 'ADM_STORE_TYPE_VW',
		col_nm: 'store_type',
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_id: 11,
		std_cd: 'insp_handling_type',
		std_nm: '검사처리유형',
		view_nm: 'ADM_INSP_HANDLING_TYPE_VW',
		col_nm: 'insp_handling_type',
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_id: 12,
		std_cd: 'file_mgmt_type',
		std_nm: '파일저장유형',
		view_nm: 'ADM_FILE_MGMT_TYPE_VW',
		col_nm: 'file_mgmt_type',
		created_uid: 1,
		updated_uid: 1
	},
];

const baseMigration = new BaseMigration('AdmStd', 'std_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };