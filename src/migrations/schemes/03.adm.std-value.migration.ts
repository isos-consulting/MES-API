import IAdmStdValue from '../../interfaces/adm/std-value.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IAdmStdValue[] = [
	{
		std_value_id: 1,
		std_value_cd: 'FILE_SAVE_TYPE',
		value: '파일저장 유형',
		std_id: 1,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 2,
		std_value_cd: 'FILE_SAVE_SERVER',
		value: '파일저장 서버 주소',
		std_id: 1,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 3,
		std_value_cd: 'FILE_SAVE_FOLDER',
		value: '파일저장 폴더',
		std_id: 1,
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 4,
		std_value_cd: 'FILE_SAVE_USER',
		value: '파일저장 서버 유저 아이디',
		std_id: 1,
		sortby: 5,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 5,
		std_value_cd: 'FILE_SAVE_PORT',
		value: '파일저장 서버 포트',
		std_id: 1,
		sortby: 4,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 6,
		std_value_cd: 'FILE_SAVE_PWD',
		value: '파일저장 서버 유저 패스워드',
		std_id: 1,
		sortby: 6,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 7,
		std_value_cd: 'MAIL_SERVER',
		value: '메일서버',
		std_id: 1,
		sortby: 7,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 8,
		std_value_cd: 'MAIL_PORT',
		value: '메일서버 포트',
		std_id: 1,
		sortby: 8,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 9,
		std_value_cd: 'MAIL_ADRESS',
		value: '메일서버 주소',
		std_id: 1,
		sortby: 9,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 10,
		std_value_cd: 'MAIL_ID',
		value: '메일 아이디',
		std_id: 1,
		sortby: 10,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 11,
		std_value_cd: 'MAIL_PWD',
		value: '메일 패스워드',
		std_id: 1,
		sortby: 11,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 12,
		std_value_cd: 'MAIL_NAME',
		value: '메일 전송자 명',
		std_id: 1,
		sortby: 12,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 13,
		std_value_cd: 'MI',
		value: '자재입고',
		std_id: 2,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 14,
		std_value_cd: 'MO',
		value: '자재반출',
		std_id: 2,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 15,
		std_value_cd: 'MOPI',
		value: '자재출고',
		std_id: 2,
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 16,
		std_value_cd: 'POMI',
		value: '자재반납',
		std_id: 2,
		sortby: 4,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 17,
		std_value_cd: 'PI',
		value: '생산입고',
		std_id: 2,
		sortby: 5,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 18,
		std_value_cd: 'PO',
		value: '생산투입',
		std_id: 2,
		sortby: 6,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 19,
		std_value_cd: 'PR',
		value: '생산부적합',
		std_id: 2,
		sortby: 7,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 20,
		std_value_cd: 'POSI',
		value: '제품입고',
		std_id: 2,
		sortby: 8,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 21,
		std_value_cd: 'SOWI',
		value: '제품출고',
		std_id: 2,
		sortby: 9,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 22,
		std_value_cd: 'WO',
		value: '제품출하',
		std_id: 2,
		sortby: 10,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 23,
		std_value_cd: 'SR',
		value: '제품반입',
		std_id: 2,
		sortby: 11,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 24,
		std_value_cd: 'OI',
		value: '사급입고',
		std_id: 2,
		sortby: 12,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 25,
		std_value_cd: 'OO',
		value: '사급출고',
		std_id: 2,
		sortby: 13,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 26,
		std_value_cd: 'INV',
		value: '재고실사',
		std_id: 2,
		sortby: 14,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 27,
		std_value_cd: 'IM',
		value: '재고이동',
		std_id: 2,
		sortby: 15,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 28,
		std_value_cd: 'IR',
		value: '재고부적합',
		std_id: 2,
		sortby: 16,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 29,
		std_value_cd: 'EI',
		value: '기타입고',
		std_id: 2,
		sortby: 17,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 30,
		std_value_cd: 'EO',
		value: '기타출고',
		std_id: 2,
		sortby: 18,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 31,
		std_value_cd: 'QR',
		value: '부적합품판정(재작업)',
		std_id: 2,
		sortby: 19,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 32,
		std_value_cd: 'QDP',
		value: '부적합품판정(폐기)',
		std_id: 2,
		sortby: 20,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 33,
		std_value_cd: 'QRW',
		value: '부적합품판정(반출대기)',
		std_id: 2,
		sortby: 21,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 34,
		std_value_cd: 'QD',
		value: '부적합품판정(분해)',
		std_id: 2,
		sortby: 22,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 35,
		std_value_cd: 'QDI',
		value: '부적합품판정(분해입고)',
		std_id: 2,
		sortby: 23,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 36,
		std_value_cd: 'QDRW',
		value: '부적합품판정(분해반출대기)',
		std_id: 2,
		sortby: 24,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 37,
		std_value_cd: 'QRIR',
		value: '수입검사 부적합',
		std_id: 2,
		sortby: 25,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 38,
		std_value_cd: 'QFIR',
		value: '최종검사 부적합',
		std_id: 2,
		sortby: 26,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 39,
		std_value_cd: 'QFII',
		value: '최종검사 입고',
		std_id: 2,
		sortby: 27,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 40,
		std_value_cd: 'BUY',
		value: 'BUY',
		std_id: 3,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 41,
		std_value_cd: 'MAKE',
		value: 'MAKE',
		std_id: 3,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 42,
		std_value_cd: 'PHANTOM',
		value: 'PHANTOM',
		std_id: 3,
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 43,
		std_value_cd: 'RECEIVE_INSP',
		value: '수입검사',
		std_id: 4,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 44,
		std_value_cd: 'PROC_INSP',
		value: '공정검사',
		std_id: 4,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 45,
		std_value_cd: 'FINAL_INSP',
		value: '최종검사',
		std_id: 4,
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 46,
		std_value_cd: 'PD',
		value: '생산출고요청',
		std_id: 5,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 47,
		std_value_cd: 'SD',
		value: '샘플출고요청',
		std_id: 5,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 48,
		std_value_cd: 'MPS',
		value: 'MPS',
		std_id: 6,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 49,
		std_value_cd: 'MRP',
		value: 'MRP',
		std_id: 6,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 50,
		std_value_cd: 'REWORK',
		value: '재작업',
		std_id: 7,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 51,
		std_value_cd: 'DISPOSAL',
		value: '폐기',
		std_id: 7,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 52,
		std_value_cd: 'DISASSEMBLE',
		value: '분해',
		std_id: 7,
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 53,
		std_value_cd: 'RETURN',
		value: '반품',
		std_id: 7,
		sortby: 4,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 54,
		std_value_cd: 'MAT_ORDER_STMT_NO',
		value: '구매발주전표번호',
		std_id: 8,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 55,
		std_value_cd: 'MAT_RECEIVE_STMT_NO',
		value: '구매입하전표번호',
		std_id: 8,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 56,
		std_value_cd: 'MAT_RETURN_STMT_NO',
		value: '구매반출전표번호',
		std_id: 8,
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 57,
		std_value_cd: 'QMS_INSP_INSP_NO',
		value: '검사기준서번호',
		std_id: 8,
		sortby: 4,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 58,
		std_value_cd: 'SAL_ORDER_STMT_NO',
		value: '제품수주전표번호',
		std_id: 8,
		sortby: 5,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 59,
		std_value_cd: 'SAL_OUTGO_ORDER_STMT_NO',
		value: '제품출하지시전표번호',
		std_id: 8,
		sortby: 6,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 60,
		std_value_cd: 'SAL_OUTGO_STMT_NO',
		value: '제품출하전표번호',
		std_id: 8,
		sortby: 7,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 61,
		std_value_cd: 'SAL_RETURN_STMT_NO',
		value: '제품반입전표번호',
		std_id: 8,
		sortby: 8,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 62,
		std_value_cd: 'PRD_ORDER_ORDER_NO',
		value: '작업지시번호',
		std_id: 8,
		sortby: 9,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 63,
		std_value_cd: 'OUT_RELEASE_STMT_NO',
		value: '외주출고전표번호',
		std_id: 8,
		sortby: 10,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 64,
		std_value_cd: 'OUT_RECEIVE_STMT_NO',
		value: '외주입고전표번호',
		std_id: 8,
		sortby: 11,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 65,
		std_value_cd: 'SELF_PROC',
		value: '자주검사',
		std_id: 9,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 66,
		std_value_cd: 'PATROL_PROC',
		value: '순회검사',
		std_id: 9,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 67,
		std_value_cd: 'MAT_RECEIVE',
		value: '자재수입검사',
		std_id: 9,
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 68,
		std_value_cd: 'OUT_RECEIVE',
		value: '외주수입검사',
		std_id: 9,
		sortby: 4,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 69,
		std_value_cd: 'FINAL_INSP',
		value: '최종검사',
		std_id: 9,
		sortby: 5,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 70,
		std_value_cd: 'available',
		value: '가용창고',
		std_id: 10,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 71,
		std_value_cd: 'finalInsp',
		value: '최종검사창고',
		std_id: 10,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 72,
		std_value_cd: 'outgo',
		value: '출하창고',
		std_id: 10,
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 73,
		std_value_cd: 'reject',
		value: '부적합창고',
		std_id: 10,
		sortby: 4,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 74,
		std_value_cd: 'return',
		value: '반출창고',
		std_id: 10,
		sortby: 5,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 75,
		std_value_cd: 'INCOME',
		value: '입고',
		std_id: 11,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 76,
		std_value_cd: 'RETURN',
		value: '반출',
		std_id: 11,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 77,
		std_value_cd: 'SELECTION',
		value: '선별',
		std_id: 11,
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 78,
		std_value_cd: 'FIL_ADM_FILES',
		value: 'MES 기본 다운로드 파일( 저장경로 -> Update 파일 올리는 경로와 동일 )',
		std_id: 12,
		sortby: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 79,
		std_value_cd: 'FIL_STD_PROD',
		value: '품목관리 첨부',
		std_id: 12,
		sortby: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 80,
		std_value_cd: 'IMG_QMS_INSP_STD',
		value: '검사기준서 이미지',
		std_id: 12,
		sortby: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 81,
		std_value_cd: 'DEC_REPORT_STOCK',
		value: '생산현황 재고 소수점',
		std_id: 1,
		sortby: 13,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 82,
		std_value_cd: 'DEC_USE_STOCK',
		value: '소요량 재고 소수점',
		std_id: 1,
		sortby: 14,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 83,
		std_value_cd: 'DEC_STOCK',
		value: '재고관리 소수점',
		std_id: 1,
		sortby: 15,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 84,
		std_value_cd: 'DEC_PRICE',
		value: '금액관리 소수점',
		std_id: 1,
		sortby: 16,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 85,
		std_value_cd: 'DEC_NOMAL',
		value: '일반 숫자 행 소수점',
		std_id: 1,
		sortby: 17,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_value_id: 86,
		std_value_cd: 'DEC_UNIT_CHANGE',
		value: '단위변환 소수점',
		std_id: 1,
		sortby: 18,
		created_uid: 1,
		updated_uid: 1
	}
];

const baseMigration = new BaseMigration('AdmStdValue', 'std_value_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };