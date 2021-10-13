import IAdmStdOptValue from '../../interfaces/adm/std-opt-value.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IAdmStdOptValue[] = [
	{
		std_opt_value_id: 1,
		std_opt_id: 1,
		value: 'FTP \/ 공유',
		std_value_id: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 2,
		std_opt_id: 3,
		value: '',
		std_value_id: 1,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 3,
		std_opt_id: 2,
		value: 'FTP',
		std_value_id: 1,
		created_uid: 1,
		updated_uid: 1
	}, 
	{
		std_opt_value_id: 4,
		std_opt_id: 1,
		value: '',
		std_value_id: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 5,
		std_opt_id: 2,
		value: 'isos.iptime.org',
		std_value_id: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 6,
		std_opt_id: 3,
		value: '',
		std_value_id: 2,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 7,
		std_opt_id: 1,
		value: `FTP의경우 '\/' 로, 공유폴더의 경우 '\\' 으로 경로 구분`,
		std_value_id: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 8,
		std_opt_id: 2,
		value: 'myweb\/UpDate\/ISO\/Upload',
		std_value_id: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 9,
		std_opt_id: 3,
		value: '',
		std_value_id: 3,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 10,
		std_opt_id: 1,
		value: '',
		std_value_id: 4,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 11,
		std_opt_id: 2,
		value: '21',
		std_value_id: 4,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 12,
		std_opt_id: 3,
		value: '',
		std_value_id: 4,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 13,
		std_opt_id: 1,
		value: '',
		std_value_id: 5,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 14,
		std_opt_id: 2,
		value: 'admin',
		std_value_id: 5,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 15,
		std_opt_id: 3,
		value: '',
		std_value_id: 5,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 16,
		std_opt_id: 1,
		value: '',
		std_value_id: 6,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 17,
		std_opt_id: 2,
		value: 'isemfdjdhwlak',
		std_value_id: 6,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 18,
		std_opt_id: 3,
		value: '',
		std_value_id: 6,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 19,
		std_opt_id: 1,
		value: '',
		std_value_id: 7,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 20,
		std_opt_id: 2,
		value: '',
		std_value_id: 7,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 21,
		std_opt_id: 3,
		value: '',
		std_value_id: 7,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 22,
		std_opt_id: 1,
		value: '',
		std_value_id: 8,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 23,
		std_opt_id: 2,
		value: '',
		std_value_id: 8,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 24,
		std_opt_id: 3,
		value: '',
		std_value_id: 8,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 25,
		std_opt_id: 1,
		value: '',
		std_value_id: 9,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 26,
		std_opt_id: 2,
		value: '',
		std_value_id: 9,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 27,
		std_opt_id: 3,
		value: '',
		std_value_id: 9,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 28,
		std_opt_id: 1,
		value: '',
		std_value_id: 10,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 29,
		std_opt_id: 2,
		value: '',
		std_value_id: 10,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 30,
		std_opt_id: 3,
		value: '',
		std_value_id: 10,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 31,
		std_opt_id: 1,
		value: '',
		std_value_id: 11,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 32,
		std_opt_id: 2,
		value: '',
		std_value_id: 11,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 33,
		std_opt_id: 3,
		value: '',
		std_value_id: 11,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 34,
		std_opt_id: 1,
		value: '',
		std_value_id: 12,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 35,
		std_opt_id: 2,
		value: '',
		std_value_id: 12,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 36,
		std_opt_id: 3,
		value: '',
		std_value_id: 12,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 37,
		std_opt_id: 4,
		value: 'MAT_INCOME',
		std_value_id: 13,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 38,
		std_opt_id: 4,
		value: 'MAT_RETURN',
		std_value_id: 14,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 39,
		std_opt_id: 4,
		value: 'MAT_RELEASE',
		std_value_id: 15,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 40,
		std_opt_id: 4,
		value: 'PRD_RETURN',
		std_value_id: 16,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 41,
		std_opt_id: 4,
		value: 'PRD_OUTPUT',
		std_value_id: 17,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 42,
		std_opt_id: 4,
		value: 'PRD_INPUT',
		std_value_id: 18,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 43,
		std_opt_id: 4,
		value: 'PRD_REJECT',
		std_value_id: 19,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 44,
		std_opt_id: 4,
		value: 'SAL_INCOME',
		std_value_id: 20,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 45,
		std_opt_id: 4,
		value: 'SAL_RELEASE',
		std_value_id: 21,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 46,
		std_opt_id: 4,
		value: 'SAL_OUTGO',
		std_value_id: 22,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 47,
		std_opt_id: 4,
		value: 'SAL_RETURN',
		std_value_id: 23,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 48,
		std_opt_id: 4,
		value: 'OUT_INCOME',
		std_value_id: 24,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 49,
		std_opt_id: 4,
		value: 'OUT_RELEASE',
		std_value_id: 25,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 50,
		std_opt_id: 4,
		value: 'INVENTORY',
		std_value_id: 26,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 51,
		std_opt_id: 4,
		value: 'INV_MOVE',
		std_value_id: 27,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 52,
		std_opt_id: 4,
		value: 'INV_REJECT',
		std_value_id: 28,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 53,
		std_opt_id: 4,
		value: 'ETC_INCOME',
		std_value_id: 29,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 54,
		std_opt_id: 4,
		value: 'ETC_RELEASE',
		std_value_id: 30,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 55,
		std_opt_id: 4,
		value: 'QMS_REWORK',
		std_value_id: 31,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 56,
		std_opt_id: 4,
		value: 'QMS_DISPOSAL',
		std_value_id: 32,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 57,
		std_opt_id: 4,
		value: 'QMS_RETURN',
		std_value_id: 33,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 58,
		std_opt_id: 4,
		value: 'QMS_DISASSEMBLE',
		std_value_id: 34,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 59,
		std_opt_id: 4,
		value: 'QMS_DISASSEMBLE_INCOME',
		std_value_id: 35,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 60,
		std_opt_id: 4,
		value: 'QMS_DISASSEMBLE_RETURN',
		std_value_id: 36,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 61,
		std_opt_id: 4,
		value: 'QMS_RECEIVE_INSP_REJECT',
		std_value_id: 37,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 62,
		std_opt_id: 4,
		value: 'QMS_FINAL_INSP_REJECT',
		std_value_id: 38,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 63,
		std_opt_id: 4,
		value: 'QMS_FINAL_INSP_INCOME',
		std_value_id: 39,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 64,
		std_opt_id: 9,
		value: '',
		std_value_id: 43,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 65,
		std_opt_id: 10,
		value: '1',
		std_value_id: 43,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 66,
		std_opt_id: 9,
		value: '1',
		std_value_id: 44,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 67,
		std_opt_id: 10,
		value: '1',
		std_value_id: 44,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 68,
		std_opt_id: 9,
		value: '0',
		std_value_id: 45,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 69,
		std_opt_id: 10,
		value: '1',
		std_value_id: 45,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 70,
		std_opt_id: 5,
		value: 'MAT_ORDER_TB',
		std_value_id: 54,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 71,
		std_opt_id: 6,
		value: '1',
		std_value_id: 54,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 72,
		std_opt_id: 7,
		value: 'stmt_no',
		std_value_id: 54,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 73,
		std_opt_id: 8,
		value: '{YYYY}{MM}{DD}{0000}',
		std_value_id: 54,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 74,
		std_opt_id: 5,
		value: 'MAT_RECEIVE_TB',
		std_value_id: 55,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 75,
		std_opt_id: 6,
		value: '1',
		std_value_id: 55,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 76,
		std_opt_id: 7,
		value: 'stmt_no',
		std_value_id: 55,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 77,
		std_opt_id: 8,
		value: '{YYYY}{MM}{DD}{0000}',
		std_value_id: 55,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 78,
		std_opt_id: 5,
		value: 'MAT_RETURN_TB',
		std_value_id: 56,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 79,
		std_opt_id: 6,
		value: '1',
		std_value_id: 56,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 80,
		std_opt_id: 7,
		value: 'stmt_no',
		std_value_id: 56,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 81,
		std_opt_id: 8,
		value: '{YYYY}{MM}{DD}{0000}',
		std_value_id: 56,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 82,
		std_opt_id: 5,
		value: 'QMS_INSP_TB',
		std_value_id: 57,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 83,
		std_opt_id: 6,
		value: '1',
		std_value_id: 57,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 84,
		std_opt_id: 7,
		value: 'insp_no',
		std_value_id: 57,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 85,
		std_opt_id: 8,
		value: '{YYYY}{MM}{DD}{0000}',
		std_value_id: 57,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 86,
		std_opt_id: 5,
		value: 'SAL_ORDER_TB',
		std_value_id: 58,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 87,
		std_opt_id: 6,
		value: '1',
		std_value_id: 58,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 88,
		std_opt_id: 7,
		value: 'stmt_no',
		std_value_id: 58,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 89,
		std_opt_id: 8,
		value: '{YYYY}{MM}{DD}{0000}',
		std_value_id: 58,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 90,
		std_opt_id: 5,
		value: 'SAL_OUTGO_ORDER_TB',
		std_value_id: 59,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 91,
		std_opt_id: 6,
		value: '1',
		std_value_id: 59,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 92,
		std_opt_id: 7,
		value: 'stmt_no',
		std_value_id: 59,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 93,
		std_opt_id: 8,
		value: '{YYYY}{MM}{DD}{0000}',
		std_value_id: 59,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 94,
		std_opt_id: 5,
		value: 'SAL_OUTGO_TB',
		std_value_id: 60,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 95,
		std_opt_id: 6,
		value: '1',
		std_value_id: 60,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 96,
		std_opt_id: 7,
		value: 'stmt_no',
		std_value_id: 60,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 97,
		std_opt_id: 8,
		value: '{YYYY}{MM}{DD}{0000}',
		std_value_id: 60,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 98,
		std_opt_id: 5,
		value: 'SAL_RETURN_TB',
		std_value_id: 61,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 99,
		std_opt_id: 6,
		value: '1',
		std_value_id: 61,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 100,
		std_opt_id: 7,
		value: 'stmt_no',
		std_value_id: 61,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 101,
		std_opt_id: 8,
		value: '{YYYY}{MM}{DD}{0000}',
		std_value_id: 61,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 102,
		std_opt_id: 5,
		value: 'PRD_ORDER_TB',
		std_value_id: 62,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 103,
		std_opt_id: 6,
		value: '1',
		std_value_id: 62,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 104,
		std_opt_id: 7,
		value: 'order_no',
		std_value_id: 62,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 105,
		std_opt_id: 8,
		value: '{YYYY}{MM}{DD}{0000}',
		std_value_id: 62,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 106,
		std_opt_id: 5,
		value: 'OUT_RELEASE_TB',
		std_value_id: 63,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 107,
		std_opt_id: 6,
		value: '1',
		std_value_id: 63,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 108,
		std_opt_id: 7,
		value: 'stmt_no',
		std_value_id: 63,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 109,
		std_opt_id: 8,
		value: '{YYYY}{MM}{DD}{0000}',
		std_value_id: 63,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 110,
		std_opt_id: 5,
		value: 'OUT_RECEIVE_TB',
		std_value_id: 64,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 111,
		std_opt_id: 6,
		value: '1',
		std_value_id: 64,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 112,
		std_opt_id: 7,
		value: 'stmt_no',
		std_value_id: 64,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 113,
		std_opt_id: 8,
		value: '{YYYY}{MM}{DD}{0000}',
		std_value_id: 64,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 114,
		std_opt_id: 11,
		value: 'PROC_INSP',
		std_value_id: 65,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 115,
		std_opt_id: 12,
		value: '1',
		std_value_id: 65,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 116,
		std_opt_id: 13,
		value: '',
		std_value_id: 65,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 117,
		std_opt_id: 11,
		value: 'PROC_INSP',
		std_value_id: 66,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 118,
		std_opt_id: 12,
		value: '0',
		std_value_id: 66,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 119,
		std_opt_id: 13,
		value: '1',
		std_value_id: 66,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 120,
		std_opt_id: 11,
		value: 'RECEIVE_INSP',
		std_value_id: 67,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 121,
		std_opt_id: 12,
		value: '',
		std_value_id: 67,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 122,
		std_opt_id: 13,
		value: '1',
		std_value_id: 67,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 123,
		std_opt_id: 11,
		value: 'RECEIVE_INSP',
		std_value_id: 68,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 124,
		std_opt_id: 12,
		value: '',
		std_value_id: 68,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 125,
		std_opt_id: 13,
		value: '1',
		std_value_id: 68,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 126,
		std_opt_id: 11,
		value: 'FINAL_INSP',
		std_value_id: 69,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 127,
		std_opt_id: 12,
		value: '',
		std_value_id: 69,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 128,
		std_opt_id: 13,
		value: '1',
		std_value_id: 69,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 129,
		std_opt_id: 14,
		value: 'available',
		std_value_id: 70,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 130,
		std_opt_id: 14,
		value: 'finalInsp',
		std_value_id: 71,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 131,
		std_opt_id: 14,
		value: 'outgo',
		std_value_id: 72,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 132,
		std_opt_id: 14,
		value: 'reject',
		std_value_id: 73,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 133,
		std_opt_id: 14,
		value: 'return',
		std_value_id: 74,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 134,
		std_opt_id: 15,
		value: '',
		std_value_id: 78,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 135,
		std_opt_id: 16,
		value: '',
		std_value_id: 78,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 136,
		std_opt_id: 15,
		value: 'STD_PROD_TB',
		std_value_id: 79,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 137,
		std_opt_id: 16,
		value: 'prod_id',
		std_value_id: 79,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 138,
		std_opt_id: 15,
		value: 'QMS_INSP_TB',
		std_value_id: 80,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 139,
		std_opt_id: 16,
		value: 'insp_id',
		std_value_id: 80,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 140,
		std_opt_id: 1,
		value: '',
		std_value_id: 81,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 141,
		std_opt_id: 2,
		value: '0',
		std_value_id: 81,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 142,
		std_opt_id: 3,
		value: '',
		std_value_id: 81,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 143,
		std_opt_id: 1,
		value: '',
		std_value_id: 82,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 144,
		std_opt_id: 2,
		value: '4',
		std_value_id: 82,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 145,
		std_opt_id: 3,
		value: '',
		std_value_id: 82,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 146,
		std_opt_id: 1,
		value: '',
		std_value_id: 83,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 147,
		std_opt_id: 2,
		value: '2',
		std_value_id: 83,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 148,
		std_opt_id: 3,
		value: '',
		std_value_id: 83,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 149,
		std_opt_id: 1,
		value: '',
		std_value_id: 84,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 150,
		std_opt_id: 2,
		value: '0',
		std_value_id: 84,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 151,
		std_opt_id: 3,
		value: '',
		std_value_id: 84,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 152,
		std_opt_id: 1,
		value: '',
		std_value_id: 85,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 153,
		std_opt_id: 2,
		value: '0',
		std_value_id: 85,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 154,
		std_opt_id: 3,
		value: '',
		std_value_id: 85,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 155,
		std_opt_id: 1,
		value: '',
		std_value_id: 86,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 156,
		std_opt_id: 2,
		value: '6',
		std_value_id: 86,
		created_uid: 1,
		updated_uid: 1
	},
	{
		std_opt_value_id: 157,
		std_opt_id: 3,
		value: '',
		std_value_id: 86,
		created_uid: 1,
		updated_uid: 1
	}
];

const baseMigration = new BaseMigration('AdmStdOptValue', 'std_opt_value_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };