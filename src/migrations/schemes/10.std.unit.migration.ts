import IStdUnit from '../../interfaces/std/unit.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdUnit[] = [
  {
		"unit_id" : 1,
		"unit_cd" : "˚",
		"unit_nm" : "˚",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "051c92a8-9987-495d-8f2a-51a2fbb40638"
	},
	{
		"unit_id" : 2,
		"unit_cd" : "cm",
		"unit_nm" : "cm",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "69a9f596-77c9-450e-9ad4-4b27507914e6"
	},
	{
		"unit_id" : 3,
		"unit_cd" : "EA",
		"unit_nm" : "EA",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "daadd44d-f510-4875-9979-59804cbbda44"
	},
	{
		"unit_id" : 4,
		"unit_cd" : "g",
		"unit_nm" : "g",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fcc48113-8b5c-46f0-b967-b045260c5c0a"
	},
	{
		"unit_id" : 5,
		"unit_cd" : "Kg",
		"unit_nm" : "Kg",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "af5bc0d1-39ad-4c16-918b-c9db9e062405"
	},
	{
		"unit_id" : 6,
		"unit_cd" : "Kg\/cm²",
		"unit_nm" : "Kg\/cm²",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "351b1399-6969-4336-8683-f56b045ca312"
	},
	{
		"unit_id" : 7,
		"unit_cd" : "Kgf",
		"unit_nm" : "Kgf",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bc5cc318-148c-4e1f-a66a-388ff1d56848"
	},
	{
		"unit_id" : 8,
		"unit_cd" : "kgf\/㎠",
		"unit_nm" : "kgf\/㎠",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d1228c01-4afd-4827-8358-2041218110aa"
	},
	{
		"unit_id" : 9,
		"unit_cd" : "M",
		"unit_nm" : "M",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0da6171d-f965-4bee-b9e8-87b062d3f106"
	},
	{
		"unit_id" : 10,
		"unit_cd" : "mm",
		"unit_nm" : "mm",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "dd100b86-901c-430d-b88b-aa72b402d922"
	},
	{
		"unit_id" : 11,
		"unit_cd" : "㎛",
		"unit_nm" : "㎛",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "63ed957d-814b-4e7a-a344-4b3ec480830d"
	},
	{
		"unit_id" : 12,
		"unit_cd" : "Nm",
		"unit_nm" : "Nm",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2e929d96-025c-4196-bf60-d3810a332749"
	},
	{
		"unit_id" : 13,
		"unit_cd" : "Ra",
		"unit_nm" : "Ra",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3f503ad0-8001-40a3-aade-75d965d66d60"
	}
]

const baseMigration = new BaseMigration('StdUnit', 'unit_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };