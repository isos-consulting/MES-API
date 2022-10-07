import IPrdPlanDaily from "../../interfaces/prd/plan-daily.interface";
import BaseMigration from "../base-migration";

// Seed Datas
const seedDatas: IPrdPlanDaily[] = [
	
];

const baseMigration = new BaseMigration('PrdPlanDaily', 'plan_daily_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };