import IStdEquip from '../../interfaces/std/equip.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdEquip[] = [
  {
		"equip_id" : 1,
		"factory_id" : 1,
		"equip_type_id" : 3,
		"equip_cd" : "001",
		"equip_nm" : "조립 1호기",
		"use_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "47121a20-1b30-49d1-9239-80baa06a041a"
	},
	{
		"equip_id" : 2,
		"factory_id" : 1,
		"equip_type_id" : 2,
		"equip_cd" : "002",
		"equip_nm" : "수동조립 1호기",
		"use_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "009f694a-d6a5-4ade-a5ec-0f7b4b6365be"
	},
	{
		"equip_id" : 3,
		"factory_id" : 1,
		"equip_type_id" : 1,
		"equip_cd" : "003",
		"equip_nm" : "쇼트 1호기",
		"use_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2ab90018-b8b6-416e-97f6-4d1623e1e896"
	},
	{
		"equip_id" : 4,
		"factory_id" : 1,
		"equip_type_id" : 5,
		"equip_cd" : "004",
		"equip_nm" : "컴프레셔 1호기",
		"use_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3c1ec29c-7583-457c-9b6b-6d29eafafcc3"
	},
	{
		"equip_id" : 5,
		"factory_id" : 1,
		"equip_type_id" : 7,
		"equip_cd" : "005",
		"equip_nm" : "CAP 라인 1호기",
		"use_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5f62fe6a-8ac6-4591-96f4-14b411c1640f"
	}
]

const baseMigration = new BaseMigration('StdEquip', 'equip_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };