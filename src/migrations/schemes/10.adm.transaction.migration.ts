import IAdmTransaction from '../../interfaces/adm/transaction.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmTransaction[] = [
	{
		tran_id : 1,
		tran_cd : "MI",
		tran_nm : "자재입고",
		sortby : 1,
		remark : "MAT_INCOME",
		created_uid : 1,
		updated_uid : 1,
		uuid : "63694639-c00c-4f05-ac42-67e4a1ba3a90"
	},
	{
		tran_id : 2,
		tran_cd : "MO",
		tran_nm : "자재반출",
		sortby : 2,
		remark : "MAT_RETURN",
		created_uid : 1,
		updated_uid : 1,
		uuid : "339fe4d1-c429-40ff-9d11-1cb41bd3cf34"
	},
	{
		tran_id : 3,
		tran_cd : "MOPI",
		tran_nm : "자재공정출고",
		sortby : 3,
		remark : "MAT_RELEASE",
		created_uid : 1,
		updated_uid : 1,
		uuid : "0385a191-5acc-4c4f-add3-60f0ea1a68eb"
	},
	{
		tran_id : 4,
		tran_cd : "POMI",
		tran_nm : "자재반납",
		sortby : 4,
		remark : "PRD_RETURN",
		created_uid : 1,
		updated_uid : 1,
		uuid : "f9b1b2ac-48d0-452a-a026-d33d21d7dea2"
	},
	{
		tran_id : 5,
		tran_cd : "PI",
		tran_nm : "생산입고",
		sortby : 5,
		remark : "PRD_OUTPUT",
		created_uid : 1,
		updated_uid : 1,
		uuid : "793a38fd-eba3-4a0f-b0a1-d802c26d437c"
	},
	{
		tran_id : 6,
		tran_cd : "PO",
		tran_nm : "생산투입",
		sortby : 6,
		remark : "PRD_INPUT",
		created_uid : 1,
		updated_uid : 1,
		uuid : "18554144-c181-40c7-b929-d9f97b16bb1a"
	},
	{
		tran_id : 7,
		tran_cd : "PR",
		tran_nm : "생산부적합",
		sortby : 7,
		remark : "PRD_REJECT",
		created_uid : 1,
		updated_uid : 1,
		uuid : "998cc742-cde9-4afe-887c-39dfd1501cea"
	},
	{
		tran_id : 8,
		tran_cd : "POSI",
		tran_nm : "제품입고",
		sortby : 8,
		remark : "SAL_INCOME",
		created_uid : 1,
		updated_uid : 1,
		uuid : "6e038b2f-128f-483c-824f-4c9fe0c10893"
	},
	{
		tran_id : 9,
		tran_cd : "SOWI",
		tran_nm : "제품출고",
		sortby : 9,
		remark : "SAL_RELEASE",
		created_uid : 1,
		updated_uid : 1,
		uuid : "841e5d0b-4967-4890-8fae-9d88281c06da"
	},
	{
		tran_id : 10,
		tran_cd : "WO",
		tran_nm : "제품출하",
		sortby : 10,
		remark : "SAL_OUTGO",
		created_uid : 1,
		updated_uid : 1,
		uuid : "b430d69b-9dd5-4974-8e1c-d91e1d8e17e3"
	},
	{
		tran_id : 11,
		tran_cd : "SR",
		tran_nm : "제품반입",
		sortby : 11,
		remark : "SAL_RETURN",
		created_uid : 1,
		updated_uid : 1,
		uuid : "bf189fc6-be64-4ac6-9c1b-6e490260bd79"
	},
	{
		tran_id : 12,
		tran_cd : "OI",
		tran_nm : "사급입고",
		sortby : 12,
		remark : "OUT_INCOME",
		created_uid : 1,
		updated_uid : 1,
		uuid : "2dfa3a45-1e49-44b5-bc19-b587a0577d4b"
	},
	{
		tran_id : 13,
		tran_cd : "OO",
		tran_nm : "사급출고",
		sortby : 13,
		remark : "OUT_RELEASE",
		created_uid : 1,
		updated_uid : 1,
		uuid : "964b422e-3622-4409-9bff-8005fdbf1ff7"
	},
	{
		tran_id : 14,
		tran_cd : "INV",
		tran_nm : "재고실사",
		sortby : 14,
		remark : "INVENTORY",
		created_uid : 1,
		updated_uid : 1,
		uuid : "816824fd-b031-4453-8204-48addff62351"
	},
	{
		tran_id : 15,
		tran_cd : "IM",
		tran_nm : "재고이동",
		sortby : 15,
		remark : "INV_MOVE",
		created_uid : 1,
		updated_uid : 1,
		uuid : "a647b215-3a3b-459b-9f62-d15a57b7a700"
	},
	{
		tran_id : 16,
		tran_cd : "IR",
		tran_nm : "재고부적합",
		sortby : 16,
		remark : "INV_REJECT",
		created_uid : 1,
		updated_uid : 1,
		uuid : "937a7460-9f59-44d7-9542-1ee8172668ae"
	},
	{
		tran_id : 17,
		tran_cd : "EI",
		tran_nm : "기타입고",
		sortby : 17,
		remark : "ETC_INCOME",
		created_uid : 1,
		updated_uid : 1,
		uuid : "fd9d1820-5ac0-4cd3-bc50-fef8813c951f"
	},
	{
		tran_id : 18,
		tran_cd : "EO",
		tran_nm : "기타출고",
		sortby : 18,
		remark : "ETC_RELEASE",
		created_uid : 1,
		updated_uid : 1,
		uuid : "8aa4a911-3d87-45e1-85b3-1d4c9e3bb5f4"
	},
	{
		tran_id : 19,
		tran_cd : "QR",
		tran_nm : "부적합품판정(재작업)",
		sortby : 19,
		remark : "QMS_REWORK",
		created_uid : 1,
		updated_uid : 1,
		uuid : "5667ca2a-c748-4a9d-89b2-cac80f1b6c7b"
	},
	{
		tran_id : 20,
		tran_cd : "QDP",
		tran_nm : "부적합품판정(폐기)",
		sortby : 20,
		remark : "QMS_DISPOSAL",
		created_uid : 1,
		updated_uid : 1,
		uuid : "924d2cbd-5bd6-4ce3-9571-6b741f6aa5e9"
	},
	{
		tran_id : 21,
		tran_cd : "QRW",
		tran_nm : "부적합품판정(반출대기)",
		sortby : 21,
		remark : "QMS_RETURN",
		created_uid : 1,
		updated_uid : 1,
		uuid : "a443d357-0b91-4d65-901e-7213a1dd455f"
	},
	{
		tran_id : 22,
		tran_cd : "QD",
		tran_nm : "부적합품판정(분해)",
		sortby : 22,
		remark : "QMS_DISASSEMBLE",
		created_uid : 1,
		updated_uid : 1,
		uuid : "3edb2723-ffaa-4356-b99e-0fa0cb2cc06e"
	},
	{
		tran_id : 23,
		tran_cd : "QDI",
		tran_nm : "부적합품판정(분해입고)",
		sortby : 23,
		remark : "QMS_DISASSEMBLE_INCOME",
		created_uid : 1,
		updated_uid : 1,
		uuid : "bd6207d3-0cdd-4f85-95e7-d561e8b57bdb"
	},
	{
		tran_id : 24,
		tran_cd : "QDRW",
		tran_nm : "부적합품판정(분해반출대기)",
		sortby : 24,
		remark : "QMS_DISASSEMBLE_RETURN",
		created_uid : 1,
		updated_uid : 1,
		uuid : "c6c1916c-6918-480d-8835-5d51ddd2320d"
	},
	{
		tran_id : 25,
		tran_cd : "QRIR",
		tran_nm : "수입검사 부적합",
		sortby : 25,
		remark : "QMS_RECEIVE_INSP_REJECT",
		created_uid : 1,
		updated_uid : 1,
		uuid : "fc8b4234-ad8e-4bc1-880c-2926a4bfdf3d"
	},
	{
		tran_id : 26,
		tran_cd : "QFIR",
		tran_nm : "최종검사 부적합",
		sortby : 26,
		remark : "QMS_FINAL_INSP_REJECT",
		created_uid : 1,
		updated_uid : 1,
		uuid : "ee7db176-22be-45df-8a73-c5e76f1a2b85"
	},
	{
		tran_id : 27,
		tran_cd : "QFII",
		tran_nm : "최종검사 입고",
		sortby : 27,
		remark : "QMS_FINAL_INSP_INCOME",
		created_uid : 1,
		updated_uid : 1,
		uuid : "a5ae27aa-b53b-41ed-93de-2a5000fdb1be"
	}
]

const baseMigration = new BaseMigration('AdmTransaction', 'tran_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };