import IStdDelivery from '../../interfaces/std/delivery.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdDelivery[] = [
  {
		"delivery_id" : 1,
		"partner_id" : 1,
		"delivery_cd" : "001",
		"delivery_nm" : "한라코리아",
		"manager" : "김재식",
		"email" : "rlawotlr@gmail.com",
		"tel" : "010-0000-0000",
		"fax" : "-",
		"post" : "01-021",
		"addr" : "-",
		"addr_detail" : "-",
		"use_fg" : true,
		"remark" : "완제품판매",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "41413809-54fa-40c3-a022-924399389739"
	},
	{
		"delivery_id" : 2,
		"partner_id" : 2,
		"delivery_cd" : "002",
		"delivery_nm" : "엔티코리아",
		"manager" : "조민규",
		"email" : "whalsrb@gmail.com",
		"tel" : "010-0000-0000",
		"fax" : "02-031",
		"post" : "01-256",
		"addr" : "-",
		"addr_detail" : "-",
		"use_fg" : true,
		"remark" : "완제품판매",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f33db501-8aa0-4b64-a50a-ea521445b46f"
	},
	{
		"delivery_id" : 3,
		"partner_id" : 2,
		"delivery_cd" : "003",
		"delivery_nm" : "테스트",
		"manager" : "김민성",
		"email" : "rlaalstjd@gmail.com",
		"tel" : "010-0000-0000",
		"fax" : "02-456-1284",
		"post" : "02-187",
		"addr" : "-",
		"addr_detail" : "-",
		"use_fg" : true,
		"remark" : "",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cafde5fe-b38c-40f7-b9e8-f87513bf01c7"
	}
]

const baseMigration = new BaseMigration('StdDelivery', 'delivery_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };