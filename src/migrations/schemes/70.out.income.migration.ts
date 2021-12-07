import moment = require('moment');
import IOutIncome from '../../interfaces/out/income.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IOutIncome[] = [
  {
		"income_id" : 1,
		"factory_id" : 1,
		"prod_id" : 22,
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"lot_no" : "20211007",
		"qty" : 20.000000,
		"receive_detail_id" : 22,
		"to_store_id" : 1,
		"to_location_id" : 1,
		"remark" : null,
		"barcode" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "16874005-bf5c-407a-9734-20d924778b05"
	},
	{
		"income_id" : 2,
		"factory_id" : 1,
		"prod_id" : 20,
		"reg_date" : moment("2021-10-06T15:00:00.000Z").toDate(),
		"lot_no" : "20211007",
		"qty" : 0.000000,
		"receive_detail_id" : 23,
		"to_store_id" : 1,
		"to_location_id" : 1,
		"remark" : null,
		"barcode" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4c6b3ff2-d6a4-4fe7-83ad-929882379181"
	},
	{
		"income_id" : 3,
		"factory_id" : 1,
		"prod_id" : 26,
		"reg_date" : moment("2021-10-13T15:00:00.000Z").toDate(),
		"lot_no" : "20211007",
		"qty" : 20.000000,
		"receive_detail_id" : 5,
		"to_store_id" : 2,
		"to_location_id" : 2,
		"remark" : null,
		"barcode" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "28453585-9e65-48c2-8dc7-c5d7ae3a1d63"
	},
	{
		"income_id" : 4,
		"factory_id" : 1,
		"prod_id" : 7,
		"reg_date" : moment("2021-10-13T15:00:00.000Z").toDate(),
		"lot_no" : "20211007",
		"qty" : 10.000000,
		"receive_detail_id" : 4,
		"to_store_id" : 1,
		"to_location_id" : null,
		"remark" : null,
		"barcode" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c03a9020-c367-4353-8dcd-a840d411c371"
	},
	{
		"income_id" : 5,
		"factory_id" : 1,
		"prod_id" : 14,
		"reg_date" : moment("2021-10-13T15:00:00.000Z").toDate(),
		"lot_no" : "20211007",
		"qty" : 20.000000,
		"receive_detail_id" : 3,
		"to_store_id" : 1,
		"to_location_id" : null,
		"remark" : null,
		"barcode" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c20b770f-3a1e-4487-bbc1-c7be929a3407"
	},
	{
		"income_id" : 6,
		"factory_id" : 1,
		"prod_id" : 11,
		"reg_date" : moment("2021-10-13T15:00:00.000Z").toDate(),
		"lot_no" : "20211007",
		"qty" : 0.000000,
		"receive_detail_id" : 2,
		"to_store_id" : 4,
		"to_location_id" : null,
		"remark" : null,
		"barcode" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fe334fce-673e-4a9d-b815-16bb5080222b"
	}
]

const baseMigration = new BaseMigration('OutIncome', 'income_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };