import IAdmReworkType from '../../interfaces/adm/rework-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmReworkType[] = [
	{
		rework_type_id : 1,
		rework_type_cd : "REWORK",
		rework_type_nm : "재작업",
		sortby : 1,
		created_uid : 1,
		updated_uid : 1,
		uuid : "677e2023-a0d6-41a1-ad97-762f3675f9c0"
	},
	{
		rework_type_id : 2,
		rework_type_cd : "DISPOSAL",
		rework_type_nm : "폐기",
		sortby : 2,
		created_uid : 1,
		updated_uid : 1,
		uuid : "28a14c50-e971-4752-b25e-a6137d59bf0f"
	},
	{
		rework_type_id : 3,
		rework_type_cd : "DISASSEMBLE",
		rework_type_nm : "분해",
		sortby : 3,
		created_uid : 1,
		updated_uid : 1,
		uuid : "00317e47-f919-4432-b363-aa8864ebaf7f"
	},
	{
		rework_type_id : 4,
		rework_type_cd : "RETURN",
		rework_type_nm : "반품",
		sortby : 4,
		created_uid : 1,
		updated_uid : 1,
		uuid : "60d9ba02-9656-4bd1-a0be-53e5cfb05017"
	}
]

const baseMigration = new BaseMigration('AdmReworkType', 'rework_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };