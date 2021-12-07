import IStdPartner from '../../interfaces/std/partner.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdPartner[] = [
  {
		"partner_id" : 1,
		"partner_cd" : "001",
		"partner_nm" : "스택폴한라",
		"partner_type_id" : 5,
		"partner_no" : "317-81-08100",
		"boss_nm" : "김재식",
		"manager" : "김재식",
		"email" : "test@gmail.com",
		"tel" : "-",
		"fax" : "-",
		"post" : "-",
		"addr" : "-",
		"addr_detail" : "-",
		"use_fg" : true,
		"vendor_fg" : true,
		"customer_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a4ca9e1a-2aa6-4217-8bb6-7033e340138e"
	},
	{
		"partner_id" : 2,
		"partner_cd" : "002",
		"partner_nm" : "NTT Korea",
		"partner_type_id" : 7,
		"partner_no" : "125-81-31900",
		"boss_nm" : "임정희",
		"manager" : "임정희",
		"email" : "test@gmail.com",
		"tel" : "-",
		"fax" : "-",
		"post" : "-",
		"addr" : "-",
		"addr_detail" : "-",
		"use_fg" : false,
		"vendor_fg" : true,
		"customer_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "adf66baa-09a7-4d6f-bc9d-086a963f33d1"
	},
	{
		"partner_id" : 3,
		"partner_cd" : "003",
		"partner_nm" : "풀스택한틸",
		"partner_type_id" : 5,
		"partner_no" : "317-81-08100",
		"boss_nm" : "정길상",
		"manager" : "정길상",
		"email" : "test@gmail.com",
		"tel" : "-",
		"fax" : "-",
		"post" : "-",
		"addr" : "-",
		"addr_detail" : "-",
		"use_fg" : true,
		"vendor_fg" : true,
		"customer_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "16b20bfd-9763-461f-9968-a43d0c9cc8d3"
	},
	{
		"partner_id" : 4,
		"partner_cd" : "004",
		"partner_nm" : "대신스와너",
		"partner_type_id" : 3,
		"partner_no" : "123-51-15588",
		"boss_nm" : "구효진",
		"manager" : "구효진",
		"email" : "test@gmail.com",
		"tel" : "-",
		"fax" : "-",
		"post" : "-",
		"addr" : "-",
		"addr_detail" : "-",
		"use_fg" : true,
		"vendor_fg" : true,
		"customer_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "03d9c28a-b97f-4cd7-8692-9029c546e75b"
	},
	{
		"partner_id" : 5,
		"partner_cd" : "005",
		"partner_nm" : "삼선철강",
		"partner_type_id" : 3,
		"partner_no" : "124-81-41500",
		"boss_nm" : "김남석",
		"manager" : "김남석",
		"email" : "test@gmail.com",
		"tel" : "-",
		"fax" : "-",
		"post" : "-",
		"addr" : "-",
		"addr_detail" : "-",
		"use_fg" : true,
		"vendor_fg" : true,
		"customer_fg" : false,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2550c5ef-c7ca-442c-8c9e-a81e294b5ab0"
	}
]

const baseMigration = new BaseMigration('StdPartner', 'partner_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };