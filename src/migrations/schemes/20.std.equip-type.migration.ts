import IStdEquipType from '../../interfaces/std/equip-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdEquipType[] = [
  {
		"equip_type_id" : 1,
		"factory_id" : 1,
		"equip_type_cd" : "001",
		"equip_type_nm" : "쇼트",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "36827e73-7157-4a20-ae5a-a8b4bda903b9"
	},
	{
		"equip_type_id" : 2,
		"factory_id" : 1,
		"equip_type_cd" : "002",
		"equip_type_nm" : "수동조립",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fe3f57dd-be70-47ee-84a1-31a60ec34d77"
	},
	{
		"equip_type_id" : 3,
		"factory_id" : 1,
		"equip_type_cd" : "003",
		"equip_type_nm" : "조립",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fee8e4e9-b26d-4d67-94c5-db5874c83c48"
	},
	{
		"equip_type_id" : 4,
		"factory_id" : 1,
		"equip_type_cd" : "004",
		"equip_type_nm" : "침유",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0ae3bea4-aa41-4266-965e-79a53687a2fd"
	},
	{
		"equip_type_id" : 5,
		"factory_id" : 1,
		"equip_type_cd" : "005",
		"equip_type_nm" : "컴프레셔",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "264d0719-800e-4748-9723-ade5867c98c0"
	},
	{
		"equip_type_id" : 6,
		"factory_id" : 1,
		"equip_type_cd" : "006",
		"equip_type_nm" : "조립2",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1c7ff3d8-0ad3-467d-9e86-a166edc7cf12"
	},
	{
		"equip_type_id" : 7,
		"factory_id" : 1,
		"equip_type_cd" : "007",
		"equip_type_nm" : "CAP 라인",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "de0fa901-bad3-4306-b9bd-39c5d32cfaeb"
	}
]

const baseMigration = new BaseMigration('StdEquipType', 'equip_type_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };