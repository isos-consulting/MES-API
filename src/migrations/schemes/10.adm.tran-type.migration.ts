import IAdmTranType from '../../interfaces/adm/tran-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmTranType[] = [
	{
		tran_type_id : 1,
		tran_type_cd : "MAT_INCOME",
		tran_type_nm : "자재입고",
		sortby : 1,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 2,
		tran_type_cd : "MAT_RETURN",
		tran_type_nm : "자재반출",
		sortby : 2,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 3,
		tran_type_cd : "MAT_RELEASE",
		tran_type_nm : "자재공정출고",
		sortby : 3,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 4,
		tran_type_cd : "PRD_RETURN",
		tran_type_nm : "자재반납",
		sortby : 4,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 5,
		tran_type_cd : "PRD_OUTPUT",
		tran_type_nm : "생산입고",
		sortby : 5,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 6,
		tran_type_cd : "PRD_INPUT",
		tran_type_nm : "생산투입",
		sortby : 6,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 7,
		tran_type_cd : "PRD_REJECT",
		tran_type_nm : "생산부적합",
		sortby : 7,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 8,
		tran_type_cd : "SAL_INCOME",
		tran_type_nm : "제품입고",
		sortby : 8,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 9,
		tran_type_cd : "SAL_RELEASE",
		tran_type_nm : "제품출고",
		sortby : 9,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 10,
		tran_type_cd : "SAL_OUTGO",
		tran_type_nm : "제품출하",
		sortby : 10,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 11,
		tran_type_cd : "SAL_RETURN",
		tran_type_nm : "제품반입",
		sortby : 11,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 12,
		tran_type_cd : "OUT_INCOME",
		tran_type_nm : "사급입고",
		sortby : 12,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 13,
		tran_type_cd : "OUT_INPUT",
		tran_type_nm : "사급투입",
		sortby : 13,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 14,
		tran_type_cd : "OUT_RELEASE",
		tran_type_nm : "사급출고",
		sortby : 14,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 15,
		tran_type_cd : "INVENTORY",
		tran_type_nm : "재고실사",
		sortby : 15,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 16,
		tran_type_cd : "INV_MOVE",
		tran_type_nm : "재고이동",
		sortby : 16,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 17,
		tran_type_cd : "INV_REJECT",
		tran_type_nm : "재고부적합",
		sortby : 17,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 18,
		tran_type_cd : "QMS_RECEIVE_INSP_REJECT",
		tran_type_nm : "수입검사 부적합",
		sortby : 18,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 19,
		tran_type_cd : "QMS_FINAL_INSP_INCOME",
		tran_type_nm : "최종검사 입고",
		sortby : 19,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 20,
		tran_type_cd : "QMS_FINAL_INSP_REJECT",
		tran_type_nm : "최종검사 부적합",
		sortby : 20,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 21,
		tran_type_cd : "QMS_REWORK",
		tran_type_nm : "부적합품판정(재작업)",
		sortby : 21,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 22,
		tran_type_cd : "QMS_DISPOSAL",
		tran_type_nm : "부적합품판정(폐기)",
		sortby : 22,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 23,
		tran_type_cd : "QMS_RETURN",
		tran_type_nm : "부적합품판정(반출대기)",
		sortby : 23,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 24,
		tran_type_cd : "QMS_DISASSEMBLE",
		tran_type_nm : "부적합품판정(분해)",
		sortby : 24,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 25,
		tran_type_cd : "QMS_DISASSEMBLE_INCOME",
		tran_type_nm : "부적합품판정(분해입고)",
		sortby : 25,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 26,
		tran_type_cd : "QMS_DISASSEMBLE_RETURN",
		tran_type_nm : "부적합품판정(분해반출대기)",
		sortby : 26,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 27,
		tran_type_cd : "ETC_INCOME",
		tran_type_nm : "기타입고",
		sortby : 27,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	},
	{
		tran_type_id : 28,
		tran_type_cd : "ETC_RELEASE",
		tran_type_nm : "기타출고",
		sortby : 28,
		remark : "",
		created_uid : 1,
		updated_uid : 1
	}
]

const baseMigration = new BaseMigration('AdmTranType', 'tran_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };