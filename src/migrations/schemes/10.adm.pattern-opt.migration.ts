import IAdmPatternOpt from '../../interfaces/adm/pattern-opt.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmPatternOpt[] = [
	{
		pattern_opt_id : 1,
		pattern_opt_cd : "MAT_ORDER_STMT_NO",
		pattern_opt_nm : "구매발주전표번호",
		table_nm : "MAT_ORDER_TB",
		auto_fg : true,
		col_nm : "stmt_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		"uuid" : "78212d93-b2da-4268-9779-5ab5a2cdcf79"
	},
	{
		pattern_opt_id : 2,
		pattern_opt_cd : "MAT_RECEIVE_STMT_NO",
		pattern_opt_nm : "구매입하전표번호",
		table_nm : "MAT_RECEIVE_TB",
		auto_fg : true,
		col_nm : "stmt_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "c56d7b81-4d84-415e-8970-1783344a702a"
	},
	{
		pattern_opt_id : 3,
		pattern_opt_cd : "MAT_RETURN_STMT_NO",
		pattern_opt_nm : "구매반출전표번호",
		table_nm : "MAT_RETURN_TB",
		auto_fg : true,
		col_nm : "stmt_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 3,
		created_uid : 1,
		updated_uid : 1,
		uuid : "17f385dd-9855-443b-899a-39ef4b4418a0"
	},
	{
		pattern_opt_id : 4,
		pattern_opt_cd : "QMS_INSP_INSP_NO",
		pattern_opt_nm : "검사기준서번호",
		table_nm : "QMS_INSP_TB",
		auto_fg : true,
		col_nm : "insp_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 4,
		created_uid : 1,
		updated_uid : 1,
		uuid : "5049b336-b224-424f-bd90-d8bde8124fa7"
	},
	{
		pattern_opt_id : 5,
		pattern_opt_cd : "SAL_ORDER_STMT_NO",
		pattern_opt_nm : "제품수주전표번호",
		table_nm : "SAL_ORDER_TB",
		auto_fg : true,
		col_nm : "stmt_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 5,
		created_uid : 1,
		updated_uid : 1,
		uuid : "4c6fc030-b983-42b1-8fb3-7cace0373e7f"
	},
	{
		pattern_opt_id : 6,
		pattern_opt_cd : "SAL_OUTGO_ORDER_STMT_NO",
		pattern_opt_nm : "제품출하지시전표번호",
		table_nm : "SAL_OUTGO_ORDER_TB",
		auto_fg : true,
		col_nm : "stmt_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 6,
		created_uid : 1,
		updated_uid : 1,
		uuid : "90917b85-5656-4fc6-a050-67b0e4dbb0c8"
	},
	{
		pattern_opt_id : 7,
		pattern_opt_cd : "SAL_OUTGO_STMT_NO",
		pattern_opt_nm : "제품출하전표번호",
		table_nm : "SAL_OUTGO_TB",
		auto_fg : true,
		col_nm : "stmt_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 7,
		created_uid : 1,
		updated_uid : 1,
		uuid : "f0d82d83-0068-42fb-ae14-338250f67442"
	},
	{
		pattern_opt_id : 8,
		pattern_opt_cd : "SAL_RETURN_STMT_NO",
		pattern_opt_nm : "제품반입전표번호",
		table_nm : "SAL_RETURN_TB",
		auto_fg : true,
		col_nm : "stmt_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 8,
		created_uid : 1,
		updated_uid : 1,
		uuid : "8896a1f8-c720-4f74-9d90-4c467529c49c"
	},
	{
		pattern_opt_id : 9,
		pattern_opt_cd : "PRD_ORDER_ORDER_NO",
		pattern_opt_nm : "작업지시번호",
		table_nm : "PRD_ORDER_TB",
		auto_fg : true,
		col_nm : "order_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 9,
		created_uid : 1,
		updated_uid : 1,
		uuid : "f8223969-f4b8-40da-8b42-f7b1978ce54c"
	},
	{
		pattern_opt_id : 10,
		pattern_opt_cd : "OUT_RELEASE_STMT_NO",
		pattern_opt_nm : "외주출고전표번호",
		table_nm : "OUT_RELEASE_TB",
		auto_fg : true,
		col_nm : "stmt_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 10,
		created_uid : 1,
		updated_uid : 1,
		uuid : "6cf376f4-23f7-4b17-9a35-bcd3d8e7335e"
	},
	{
		pattern_opt_id : 11,
		pattern_opt_cd : "OUT_RECEIVE_STMT_NO",
		pattern_opt_nm : "외주입고전표번호",
		table_nm : "OUT_RECEIVE_TB",
		auto_fg : true,
		col_nm : "stmt_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 11,
		created_uid : 1,
		updated_uid : 1,
		uuid : "8fa7fc3b-c4f2-437d-96c2-9ff7637b8c98"
	},
	{
		pattern_opt_id : 12,
		pattern_opt_cd : "EQM_INSP_INSP_NO",
		pattern_opt_nm : "설비검사기준서번호",
		table_nm : "EQM_INSP_TB",
		auto_fg : true,
		col_nm : "insp_no",
		pattern : "{YYYY}{MM}{DD}{0000}",
		sortby : 12,
		created_uid : 1,
		updated_uid : 1,
		uuid : "cc9d3b37-5af9-44c5-8bea-4c6a94a9484f"
	},
]

const baseMigration = new BaseMigration('AdmPatternOpt', 'pattern_opt_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };