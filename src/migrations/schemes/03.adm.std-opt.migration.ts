import IAdmStdOpt from '../../interfaces/adm/std-opt.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IAdmStdOpt[] = [
  {
		std_opt_id: 1,
		std_opt_cd: 'remark',
		std_opt_nm: '비고',
		std_id: 1,
		col_use_fg: true,
		col_gb: 'varchar(250)',
		alias: 'remark',
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 2,
		std_opt_cd: 'val',
		std_opt_nm: '값',
		std_id: 1,
		col_use_fg: true,
		col_gb: 'varchar(50)',
		alias: 'val',
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 3,
		std_opt_cd: 'val_opt',
		std_opt_nm: '상세옵션',
		std_id: 1,
		col_use_fg: true,
		col_gb: 'varchar(50)',
		alias: 'val_opt',
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 4,
		std_opt_cd: 'remark',
		std_opt_nm: '비고',
		std_id: 2,
		col_use_fg: true,
		col_gb: 'varchar(250)',
		alias: 'remark',
		sortby: 5,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 5,
		std_opt_cd: 'table_nm',
		std_opt_nm: '테이블명',
		std_id: 8,
		col_use_fg: true,
		col_gb: 'varchar(100)',
		alias: 'table_nm',
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 6,
		std_opt_cd: 'auto_fg',
		std_opt_nm: '자동발행 여부',
		std_id: 8,
		col_use_fg: true,
		col_gb: 'boolean',
		alias: 'auto_fg',
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 7,
		std_opt_cd: 'col_nm',
		std_opt_nm: '컬럼명',
		std_id: 8,
		col_use_fg: true,
		col_gb: 'varchar(100)',
		alias: 'col_nm',
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 8,
		std_opt_cd: 'pattern',
		std_opt_nm: '패턴',
		std_id: 8,
		col_use_fg: true,
		col_gb: 'varchar(200)',
		alias: 'pattern',
		sortby: 4,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 9,
		std_opt_cd: 'worker_fg',
		std_opt_nm: '작업자',
		std_id: 4,
		col_use_fg: true,
		col_gb: 'boolean',
		alias: 'worker_fg',
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 10,
		std_opt_cd: 'inspector_fg',
		std_opt_nm: '검사원',
		std_id: 4,
		col_use_fg: true,
		col_gb: 'boolean',
		alias: 'inspector_fg',
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 11,
		std_opt_cd: 'insp_type_cd',
		std_opt_nm: '검사유형코드',
		std_id: 9,
		col_use_fg: true,
		col_gb: 'varchar(50)',
		alias: 'insp_type_cd',
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 12,
		std_opt_cd: 'worker_fg',
		std_opt_nm: '작업자',
		std_id: 9,
		col_use_fg: true,
		col_gb: 'boolean',
		alias: 'worker_fg',
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 13,
		std_opt_cd: 'inspector_fg',
		std_opt_nm: '검사원',
		std_id: 9,
		col_use_fg: true,
		col_gb: 'boolean',
		alias: 'inspector_fg',
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 14,
		std_opt_cd: 'parameter_nm',
		std_opt_nm: '파라미터 명',
		std_id: 10,
		col_use_fg: true,
		col_gb: 'varchar(20)',
		alias: 'parameter_nm',
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 15,
		std_opt_cd: 'table_nm',
		std_opt_nm: '테이블명',
		std_id: 12,
		col_use_fg: true,
		col_gb: 'table_nm',
		alias: 'table_nm',
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_id: 16,
		std_opt_cd: 'id_nm',
		std_opt_nm: '아이디컬럼명',
		std_id: 12,
		col_use_fg: true,
		col_gb: 'varchar(30)',
		alias: 'id_nm',
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	}
];

const baseMigration = new BaseMigration('AdmStdOpt', 'std_opt_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };