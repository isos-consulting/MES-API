import IAdmCompanyOpt from '../../interfaces/adm/company-opt.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmCompanyOpt[] = [
	{
		company_opt_id : 1,
		company_opt_cd : "FILE_SAVE_TYPE",
		company_opt_nm : "파일저장 유형",
		val : "FTP",
		val_opt : "",
		sortby : 1,
		remark : "FTP \/ 공유",
		created_uid : 1,
		updated_uid : 1,
		uuid : "ec7e5896-04dd-476a-81f8-de1c4a26889a"
	},
	{
		company_opt_id : 2,
		company_opt_cd : "FILE_SAVE_SERVER",
		company_opt_nm : "파일저장 서버 주소",
		val : "isos.iptime.org",
		val_opt : "",
		sortby : 2,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "a132e2f8-e3df-4b4c-95ac-be0c596953c9"
	},
	{
		company_opt_id : 3,
		company_opt_cd : "FILE_SAVE_FOLDER",
		company_opt_nm : "파일저장 폴더",
		val : "myweb\/UpDate\/ISO\/Upload",
		val_opt : "",
		sortby : 3,
		remark : "FTP의경우 '\/' 로, 공유폴더의 경우 '\\' 으로 경로 구분",
		created_uid : 1,
		updated_uid : 1,
		uuid : "d2d9dee6-e9e1-4c48-a73c-c9e71a428d10"
	},
	{
		company_opt_id : 4,
		company_opt_cd : "FILE_SAVE_PORT",
		company_opt_nm : "파일저장 서버 포트",
		val : "admin",
		val_opt : "",
		sortby : 4,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "95f1ce9d-bed6-45cd-98ac-bfa367282671"
	},
	{
		company_opt_id : 5,
		company_opt_cd : "FILE_SAVE_USER",
		company_opt_nm : "파일저장 서버 유저 아이디",
		val : "21",
		val_opt : "",
		sortby : 5,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "148cda11-a0e6-4683-b93c-4ce89f1def4f"
	},
	{
		company_opt_id : 6,
		company_opt_cd : "FILE_SAVE_PWD",
		company_opt_nm : "파일저장 서버 유저 패스워드",
		val : "isemfdjdhwlak",
		val_opt : "",
		sortby : 6,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "4ab5364f-f3b9-4f73-b311-5cc70439a0bb"
	},
	{
		company_opt_id : 7,
		company_opt_cd : "MAIL_SERVER",
		company_opt_nm : "메일서버",
		val : "",
		val_opt : "",
		sortby : 7,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "30366577-0e9f-4706-a712-a4231b8afa0d"
	},
	{
		company_opt_id : 8,
		company_opt_cd : "MAIL_PORT",
		company_opt_nm : "메일서버 포트",
		val : "",
		val_opt : "",
		sortby : 8,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "d6280411-fca2-4c16-a6f6-b058b4c0f39e"
	},
	{
		company_opt_id : 9,
		company_opt_cd : "MAIL_ADRESS",
		company_opt_nm : "메일서버 주소",
		val : "",
		val_opt : "",
		sortby : 9,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "2b13ae74-cf5f-4a83-b60a-e58d78eaffc6"
	},
	{
		company_opt_id : 10,
		company_opt_cd : "MAIL_ID",
		company_opt_nm : "메일 아이디",
		val : "",
		val_opt : "",
		sortby : 10,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "7058d2c4-c3e9-4cc4-b8bd-fab7daebf6d6"
	},
	{
		company_opt_id : 11,
		company_opt_cd : "MAIL_PWD",
		company_opt_nm : "메일 패스워드",
		val : "",
		val_opt : "",
		sortby : 11,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "09ad080f-8054-416a-ab60-66f3bb9a445b"
	},
	{
		company_opt_id : 12,
		company_opt_cd : "MAIL_NAME",
		company_opt_nm : "메일 전송자 명",
		val : "",
		val_opt : "",
		sortby : 12,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "b507f4c8-b16c-46cd-b99d-0ce570e2f607"
	},
	{
		company_opt_id : 13,
		company_opt_cd : "DEC_REPORT_STOCK",
		company_opt_nm : "생산현황 재고 소수점",
		val : "0",
		val_opt : "",
		sortby : 13,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "7a978676-0be7-46d7-8333-44d0085c76f5"
	},
	{
		company_opt_id : 14,
		company_opt_cd : "DEC_USE_STOCK",
		company_opt_nm : "소요량 재고 소수점",
		val : "4",
		val_opt : "",
		sortby : 14,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "0ef2bcf0-b1dd-42ce-81d5-a1b77835d5a8"
	},
	{
		company_opt_id : 15,
		company_opt_cd : "DEC_STOCK",
		company_opt_nm : "재고관리 소수점",
		val : "2",
		val_opt : "",
		sortby : 15,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "c71d7e28-9420-42ee-b3ba-6932e5142608"
	},
	{
		company_opt_id : 16,
		company_opt_cd : "DEC_PRICE",
		company_opt_nm : "금액관리 소수점",
		val : "0",
		val_opt : "",
		sortby : 16,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "baa2bc53-1975-4ec2-a13d-2309f8df015e"
	},
	{
		company_opt_id : 17,
		company_opt_cd : "DEC_NOMAL",
		company_opt_nm : "일반 숫자 행 소수점",
		val : "0",
		val_opt : "",
		sortby : 17,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "20e71438-b6e5-4037-be40-b6f41117f2a0"
	},
	{
		company_opt_id : 18,
		company_opt_cd : "DEC_UNIT_CHANGE",
		company_opt_nm : "단위변환 소수점",
		val : "6",
		val_opt : "",
		sortby : 18,
		remark : "",
		created_uid : 1,
		updated_uid : 1,
		uuid : "75ac25ed-c4b8-4468-b1cb-7f15148f4eca"
	}
]

const baseMigration = new BaseMigration('AdmCompanyOpt', 'company_opt_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };3

