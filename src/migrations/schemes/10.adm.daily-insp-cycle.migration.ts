import IAdmDailyInspCycle from '../../interfaces/adm/daily-insp-cycle.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmDailyInspCycle[] = [
	{
		"daily_insp_cycle_id" : 1,
		"daily_insp_cycle_cd" : "BEFORE_WORK",
		"daily_insp_cycle_nm" : "작업시작전",
    "sortby": 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8496aaa4-4e2d-4987-a609-1f530c437d82"
	},
	{
		"daily_insp_cycle_id" : 2,
		"daily_insp_cycle_cd" : "SHIFT",
		"daily_insp_cycle_nm" : "쉬프트",
    "sortby": 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a4ec4025-6f95-4b8d-90aa-9f293f515400"
	},
	{
		"daily_insp_cycle_id" : 3,
		"daily_insp_cycle_cd" : "DAILY",
		"daily_insp_cycle_nm" : "매일",
    "sortby": 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6ddd2740-262d-4784-9f3a-ecea97b5758d"
	},
	{
		"daily_insp_cycle_id" : 4,
		"daily_insp_cycle_cd" : "EVERYTIME",
		"daily_insp_cycle_nm" : "매회",
    "sortby": 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6820f7d3-6a63-4840-905e-9bb9a3fde012"
	}
]

const baseMigration = new BaseMigration('AdmDailyInspCycle', 'daily_insp_cycle_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };