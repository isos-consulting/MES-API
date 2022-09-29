import IPrdWorkPlanMonth from "../../interfaces/prd/work-plan-month.interface";
import BaseMigration from "../base-migration";

// Seed Datas
const seedDatas: IPrdWorkPlanMonth[] = [
	
];

const baseMigration = new BaseMigration('PrdWorkPlanMonth', 'work_plan_month_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };