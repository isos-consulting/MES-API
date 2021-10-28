import IStdSupplier from '../../interfaces/std/supplier.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdSupplier[] = [
  {
		"supplier_id" : 1,
		"partner_id" : 5,
		"supplier_cd" : "001",
		"supplier_nm" : "삼선철강-천안",
		"manager" : "김민석",
		"email" : "rlaalstjd@gmail.com",
		"tel" : "000-0000-0000",
		"fax" : "-",
		"post" : "-",
		"addr" : "-",
		"addr_detail" : "-",
		"use_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f7c9b2cc-a58f-4390-8b3e-c03b4738614c"
	},
	{
		"supplier_id" : 2,
		"partner_id" : 5,
		"supplier_cd" : "002",
		"supplier_nm" : "삼선철강-평택",
		"manager" : "조민기",
		"email" : "whalsrl@naver.com",
		"tel" : "000-0000-0000",
		"fax" : "",
		"post" : "",
		"addr" : "",
		"addr_detail" : "",
		"use_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e0d1af4a-c0a1-4782-9bd1-9b7980f4a404"
	},
	{
		"supplier_id" : 3,
		"partner_id" : 5,
		"supplier_cd" : "003",
		"supplier_nm" : "삼선철강-인천",
		"manager" : "고민수",
		"email" : "rhalstn@@gmail.com",
		"tel" : "000-0000-0000",
		"fax" : "",
		"post" : "",
		"addr" : "",
		"addr_detail" : "",
		"use_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f73e5de8-75c0-4725-8798-064e8fcb3c23"
	},
	{
		"supplier_id" : 4,
		"partner_id" : 4,
		"supplier_cd" : "004",
		"supplier_nm" : "대신스와너-천안",
		"manager" : "김성열",
		"email" : "rlatjdduf@@gmail.com",
		"tel" : "000-0000-0000",
		"fax" : "",
		"post" : "",
		"addr" : "",
		"addr_detail" : "",
		"use_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f8f0e0cd-17ae-466a-87a2-b85bc79ed267"
	},
	{
		"supplier_id" : 5,
		"partner_id" : 4,
		"supplier_cd" : "005",
		"supplier_nm" : "대신스와너-평택",
		"manager" : "엄윤동",
		"email" : "djadbsehd@@gmail.com",
		"tel" : "000-0000-0000",
		"fax" : "",
		"post" : "",
		"addr" : "",
		"addr_detail" : "",
		"use_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "022c9918-d55d-4902-a343-01e021d3e178"
	}
]

const baseMigration = new BaseMigration('StdSupplier', 'supplier_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };