import IAdmPrdPlanType from '../../interfaces/adm/prd-plan-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmPrdPlanType[] = [
	{
		prd_plan_type_id : 1,
		prd_plan_type_cd : "MPS",
		prd_plan_type_nm : "MPS",
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "e865835a-7658-4ab7-9dcd-5459ca6bfb3c"
	},
	{
		prd_plan_type_id : 2,
		prd_plan_type_cd : "MRP",
		prd_plan_type_nm : "MRP",
		sortby : 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "10a807a1-e72d-4013-8da1-28306331e0c4"
	}
]

const baseMigration = new BaseMigration('AdmPrdPlanType', 'prd_plan_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };