import IAdmCycleUnit from '../../interfaces/adm/cycle-unit.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmCycleUnit[] = [
	{
		cycle_unit_id : 1,
		cycle_unit_cd : "YEAR",
		cycle_unit_nm : "년",
		format : "Y",
		sortby: 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "8ca9d038-777c-46e7-a2c4-91ee1a24014f"
	},
	{
		cycle_unit_id : 2,
		cycle_unit_cd : "MONTH",
		cycle_unit_nm : "월",
		format : "M",
		sortby: 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "b1aea4e6-3bc1-4e69-97e0-92752f19b750"
	},
	{
		cycle_unit_id : 3,
		cycle_unit_cd : "WEEK",
		cycle_unit_nm : "주",
		format : "W",
		sortby: 3,
		created_uid : 1,
		updated_uid : 1,
		uuid : "f2b34cbc-4aab-40cb-a011-f67e27505fb6"
	},
	{
		cycle_unit_id : 4,
		cycle_unit_cd : "DAY",
		cycle_unit_nm : "일",
		format : "D",
		sortby: 4,
		created_uid : 1,
		updated_uid : 1,
		uuid : "42487b14-728d-44c3-a504-6c848092a244"
	}
]

const baseMigration = new BaseMigration('AdmCycleUnit', 'cycle_unit_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };