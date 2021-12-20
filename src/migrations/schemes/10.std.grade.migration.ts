import IStdGrade from '../../interfaces/std/grade.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdGrade[] = [
  {
		"grade_id" : 1,
		"grade_cd" : "001",
		"grade_nm" : "사장",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5beef657-d7fb-4772-9980-db063bd1c8ab"
	},
	{
		"grade_id" : 2,
		"grade_cd" : "002",
		"grade_nm" : "부사장",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "04b0c6e4-2dd7-45ab-aa2d-dce83ce43842"
	},
	{
		"grade_id" : 3,
		"grade_cd" : "003",
		"grade_nm" : "전무",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2ee9246d-c914-40bd-b6b3-e254113dda8e"
	},
	{
		"grade_id" : 4,
		"grade_cd" : "004",
		"grade_nm" : "상무",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "37ec3e2d-d32a-487c-89a0-e76c0e1e419d"
	},
	{
		"grade_id" : 5,
		"grade_cd" : "005",
		"grade_nm" : "이사",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b34127a8-6564-4ca5-809e-32bc9c869119"
	},
	{
		"grade_id" : 6,
		"grade_cd" : "006",
		"grade_nm" : "부장",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a9945249-1229-465b-af57-670966807dc7"
	},
	{
		"grade_id" : 7,
		"grade_cd" : "007",
		"grade_nm" : "차장",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0a10ce34-031c-4316-a9ab-86ad668487ec"
	},
	{
		"grade_id" : 8,
		"grade_cd" : "008",
		"grade_nm" : "과장",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0dab055e-c734-478f-900c-a92935e333fd"
	},
	{
		"grade_id" : 9,
		"grade_cd" : "009",
		"grade_nm" : "대리",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "110a6c7f-12b1-4c5f-bb87-f67bd4943473"
	},
	{
		"grade_id" : 10,
		"grade_cd" : "010",
		"grade_nm" : "관리사원",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6e8bc700-f886-4e2f-994f-27a3b0c44f69"
	},
	{
		"grade_id" : 11,
		"grade_cd" : "000",
		"grade_nm" : "기장",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e69382ed-8af5-46bb-b16f-afe9083e6575"
	},
	{
		"grade_id" : 12,
		"grade_cd" : "012",
		"grade_nm" : "직장",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "acc6c1ea-c710-4f36-9ba4-2d89244bdf1f"
	},
	{
		"grade_id" : 13,
		"grade_cd" : "013",
		"grade_nm" : "반장",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cef66a2a-21b1-4219-83cb-43a61200c92b"
	},
	{
		"grade_id" : 14,
		"grade_cd" : "014",
		"grade_nm" : "조장",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c071cb5b-c5f9-4161-adf1-ffad3c4914e9"
	},
	{
		"grade_id" : 15,
		"grade_cd" : "015",
		"grade_nm" : "사원",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0e7246ce-5e32-4d91-b239-dbd241c669a1"
	},
	{
		"grade_id" : 16,
		"grade_cd" : "016",
		"grade_nm" : "별정직",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d146cb35-aee2-4052-aeb0-d1428ba576f4"
	},
	{
		"grade_id" : 17,
		"grade_cd" : "017",
		"grade_nm" : "주임",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a2ff9881-0619-4588-8866-285e15b54577"
	},
	{
		"grade_id" : 18,
		"grade_cd" : "018",
		"grade_nm" : "사원",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "89f71ba5-4d02-45f3-b3b6-d941af9bc66e"
	},
	{
		"grade_id" : 19,
		"grade_cd" : "019",
		"grade_nm" : "용역",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c2b9cbe9-6ec2-4cc0-abe0-a4d414961001"
	}
]

const baseMigration = new BaseMigration('StdGrade', 'grade_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };