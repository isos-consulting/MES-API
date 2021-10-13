import IAutMenuType from '../../interfaces/aut/menu-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAutMenuType[] = [
  {
		menu_type_id: 1,
		menu_type_nm: 'Report',
		create_fg: false,
		read_fg: true,
		update_fg: false,
		delete_fg: false,
		created_uid: 1,
		updated_uid: 1
	},
	{
		menu_type_id: 2,
		menu_type_nm: 'Standard',
		create_fg: true,
		read_fg: true,
		update_fg: true,
		delete_fg: true,
		created_uid: 1,
		updated_uid: 1
	},
	{
		menu_type_id: 3,
		menu_type_nm: 'CreateOnly',
		create_fg: true,
		read_fg: true,
		update_fg: false,
		delete_fg: false,
		created_uid: 1,
		updated_uid: 1
	},
	{
		menu_type_id: 4,
		menu_type_nm: 'UpdateOnly',
		create_fg: false,
		read_fg: true,
		update_fg: true,
		delete_fg: false,
		created_uid: 1,
		updated_uid: 1
	},
	{
		menu_type_id: 5,
		menu_type_nm: 'DeleteOnly',
		create_fg: false,
		read_fg: true,
		update_fg: false,
		delete_fg: true,
		created_uid: 1,
		updated_uid: 1
	},
	{
		menu_type_id: 6,
		menu_type_nm: 'UpdateDelete',
		create_fg: false,
		read_fg: true,
		update_fg: true,
		delete_fg: true,
		created_uid: 1,
		updated_uid: 1
	},
	{
		menu_type_id: 7,
		menu_type_nm: 'Level',
		create_fg: false,
		read_fg: false,
		update_fg: false,
		delete_fg: false,
		created_uid: 1,
		updated_uid: 1
	}
];

const baseMigration = new BaseMigration('AutMenuType', 'menu_type_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };