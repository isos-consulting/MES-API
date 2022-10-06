import IPrdPlanMonthly from "../../interfaces/prd/plan-monthly.interface";
import BaseMigration from "../base-migration";

// Seed Datas
const seedDatas: IPrdPlanMonthly[] = [
	
];

const baseMigration = new BaseMigration('PrdPlanMonthly', 'plan_monthly_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };