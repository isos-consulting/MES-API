import IStdPartnerProd from '../../interfaces/std/partner-prod.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdPartnerProd[] = [
	{
		"partner_prod_id" : 1,
		"partner_id" : 1,
		"prod_id" : 1,
		"partner_prod_no" : "CELLO_VS3",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "59d783cd-9138-44cc-9ed3-eb2120aa1705"
	},
	{
		"partner_prod_id" : 2,
		"partner_id" : 1,
		"prod_id" : 2,
		"partner_prod_no" : "CELLO_VS4",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b9404e30-15af-4646-a157-1e01c12d2879"
	},
	{
		"partner_prod_id" : 3,
		"partner_id" : 1,
		"prod_id" : 4,
		"partner_prod_no" : "FUJI_VS1",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1f6917d2-2883-44ed-8f64-435f2041c31c"
	},
	{
		"partner_prod_id" : 4,
		"partner_id" : 1,
		"prod_id" : 3,
		"partner_prod_no" : "FUJI_VS2",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b80239c2-0d43-4d6e-802f-c89aee78f5c6"
	},
	{
		"partner_prod_id" : 5,
		"partner_id" : 1,
		"prod_id" : 5,
		"partner_prod_no" : "FUJI_VS3",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ae9a0af8-692d-4e52-b67f-b36097412b6e"
	},
	{
		"partner_prod_id" : 6,
		"partner_id" : 2,
		"prod_id" : 5,
		"partner_prod_no" : "PIPE_001",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f09b08fd-d6ab-4491-be76-71b7421e4d03"
	},
	{
		"partner_prod_id" : 7,
		"partner_id" : 2,
		"prod_id" : 4,
		"partner_prod_no" : "PIPE_002",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2b31b736-ef01-4c42-85c8-3a9465d9371b"
	},
	{
		"partner_prod_id" : 8,
		"partner_id" : 2,
		"prod_id" : 3,
		"partner_prod_no" : "PIPE_003",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c60587ff-0136-4062-9d0c-0dd80fe3e111"
	},
	{
		"partner_prod_id" : 9,
		"partner_id" : 3,
		"prod_id" : 6,
		"partner_prod_no" : "STILL_001",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1e888908-3a7d-41f7-835f-e8ce76ebf254"
	},
	{
		"partner_prod_id" : 10,
		"partner_id" : 3,
		"prod_id" : 7,
		"partner_prod_no" : "STILL_004",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8c2e436e-241c-47e6-8297-6ee0bcc757e2"
	},
	{
		"partner_prod_id" : 11,
		"partner_id" : 3,
		"prod_id" : 8,
		"partner_prod_no" : "STILL_003",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b52705db-fae8-47c5-8e21-ea3826b8ae8c"
	},
	{
		"partner_prod_id" : 12,
		"partner_id" : 4,
		"prod_id" : 16,
		"partner_prod_no" : "SPANER_TS_01",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b12908e0-af9c-4cf5-9abf-3abfb08adb39"
	},
	{
		"partner_prod_id" : 13,
		"partner_id" : 4,
		"prod_id" : 17,
		"partner_prod_no" : "SPANER_TS_02",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "81a1dbf7-b451-4561-8381-058def3e1f9d"
	},
	{
		"partner_prod_id" : 14,
		"partner_id" : 4,
		"prod_id" : 18,
		"partner_prod_no" : "SPANER_TS_03",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bbdc06af-9be8-450d-9709-3712b360ccaf"
	},
	{
		"partner_prod_id" : 15,
		"partner_id" : 4,
		"prod_id" : 19,
		"partner_prod_no" : "SPANER_TS_04",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "66a004b1-411b-48fe-baa4-96e485aff6ee"
	},
	{
		"partner_prod_id" : 16,
		"partner_id" : 4,
		"prod_id" : 8,
		"partner_prod_no" : "PINER_ST_01",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bbc3a734-fa4f-4e2d-999d-69f33f0241c7"
	},
	{
		"partner_prod_id" : 17,
		"partner_id" : 5,
		"prod_id" : 12,
		"partner_prod_no" : "START_TH_01",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ece6edcf-e9eb-4022-a6bd-ee8d0c1b50a5"
	},
	{
		"partner_prod_id" : 18,
		"partner_id" : 5,
		"prod_id" : 10,
		"partner_prod_no" : "START_TH_02",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9e458721-4257-4902-91a9-08874e559f83"
	},
	{
		"partner_prod_id" : 19,
		"partner_id" : 5,
		"prod_id" : 11,
		"partner_prod_no" : "START_TH_03",
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e71d489e-9fc8-4059-9444-1d39d32508ee"
	}
]

const baseMigration = new BaseMigration('StdPartnerProd', 'partner_prod_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };