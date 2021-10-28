import IPrdOrderWorker from '../../interfaces/prd/order-worker.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdOrderWorker[] = [
  {
		"order_worker_id" : 1,
		"factory_id" : 1,
		"order_id" : 1,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "34a975a6-d968-4972-9c89-d3f65ed69f6b"
	},
	{
		"order_worker_id" : 2,
		"factory_id" : 1,
		"order_id" : 1,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3ddb6451-3148-4491-9a70-08adad4a9afc"
	},
	{
		"order_worker_id" : 3,
		"factory_id" : 1,
		"order_id" : 1,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fe08b2bf-1718-4eb4-87b5-66890d3b2ff2"
	},
	{
		"order_worker_id" : 4,
		"factory_id" : 1,
		"order_id" : 1,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "df9aa82d-4a9d-40b9-9639-fab87fd90ffb"
	},
	{
		"order_worker_id" : 5,
		"factory_id" : 1,
		"order_id" : 1,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2ab58a10-62ce-41fa-8312-f443142b0ef9"
	},
	{
		"order_worker_id" : 6,
		"factory_id" : 1,
		"order_id" : 2,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cf436c71-33c4-411a-8099-cd41f18fc4b0"
	},
	{
		"order_worker_id" : 7,
		"factory_id" : 1,
		"order_id" : 2,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "49bcb835-d9ca-4313-9d06-97b37f1f1fff"
	},
	{
		"order_worker_id" : 8,
		"factory_id" : 1,
		"order_id" : 2,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bae22f72-9ad4-4a0d-aac3-e177b84b36ab"
	},
	{
		"order_worker_id" : 9,
		"factory_id" : 1,
		"order_id" : 2,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "598161f6-f359-4c05-bbbb-42ce8f2a0fb0"
	},
	{
		"order_worker_id" : 10,
		"factory_id" : 1,
		"order_id" : 2,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5b05ffb2-0e63-436f-9051-55986aebe85a"
	},
	{
		"order_worker_id" : 11,
		"factory_id" : 1,
		"order_id" : 3,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1e74141d-dd1b-4e1e-ab61-535a911216b4"
	},
	{
		"order_worker_id" : 12,
		"factory_id" : 1,
		"order_id" : 3,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1da60e00-ac1d-4241-bbc0-44e2777b3be5"
	},
	{
		"order_worker_id" : 13,
		"factory_id" : 1,
		"order_id" : 3,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "20377d84-1033-4ca1-be23-50e1e11e7e52"
	},
	{
		"order_worker_id" : 14,
		"factory_id" : 1,
		"order_id" : 3,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fb9d0e46-5274-48d6-87e7-d2d5607eef9f"
	},
	{
		"order_worker_id" : 15,
		"factory_id" : 1,
		"order_id" : 3,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "392e33c1-b1eb-4d89-a97a-afaffa4ee70a"
	},
	{
		"order_worker_id" : 16,
		"factory_id" : 1,
		"order_id" : 4,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "39270cda-63b0-4da0-8323-ed98fc7ae786"
	},
	{
		"order_worker_id" : 17,
		"factory_id" : 1,
		"order_id" : 4,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3d576bb8-f040-4dcc-8fe8-a41a9a70a0c8"
	},
	{
		"order_worker_id" : 18,
		"factory_id" : 1,
		"order_id" : 4,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7c0a53d5-7e95-4831-b732-923405b96b17"
	},
	{
		"order_worker_id" : 19,
		"factory_id" : 1,
		"order_id" : 4,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a884c68e-608c-4de3-83d0-529421de7691"
	},
	{
		"order_worker_id" : 20,
		"factory_id" : 1,
		"order_id" : 4,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2bb1bbce-d527-46a2-bffc-421b2a7aa0ea"
	},
	{
		"order_worker_id" : 21,
		"factory_id" : 1,
		"order_id" : 5,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "05b135aa-f38d-4f53-be2a-01c26b781a42"
	},
	{
		"order_worker_id" : 22,
		"factory_id" : 1,
		"order_id" : 5,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "853958ce-16a5-449f-9981-f65a837fa295"
	},
	{
		"order_worker_id" : 23,
		"factory_id" : 1,
		"order_id" : 5,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3f8a3142-aadb-472e-b93f-f10906548bd1"
	},
	{
		"order_worker_id" : 24,
		"factory_id" : 1,
		"order_id" : 5,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6999432c-3ceb-4811-8146-b1966f97eb2b"
	},
	{
		"order_worker_id" : 25,
		"factory_id" : 1,
		"order_id" : 5,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0b73714d-101c-4382-861d-88644cafe43a"
	},
	{
		"order_worker_id" : 26,
		"factory_id" : 1,
		"order_id" : 6,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ad79585a-a1c9-4331-80e8-be7e051642c8"
	},
	{
		"order_worker_id" : 27,
		"factory_id" : 1,
		"order_id" : 6,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3e6db181-d24a-4cac-897c-98802b1d673a"
	},
	{
		"order_worker_id" : 28,
		"factory_id" : 1,
		"order_id" : 6,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d99cea91-e695-4a7e-9cdb-74e8464e1d8f"
	},
	{
		"order_worker_id" : 29,
		"factory_id" : 1,
		"order_id" : 6,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c7c44326-b18a-4e16-b7b9-7bfc7cb437b9"
	},
	{
		"order_worker_id" : 30,
		"factory_id" : 1,
		"order_id" : 6,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ea32b88c-f3a3-47e6-b0d8-dd36fdaef348"
	},
	{
		"order_worker_id" : 31,
		"factory_id" : 1,
		"order_id" : 7,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ff200562-e37a-4aec-8989-b72f196b5039"
	},
	{
		"order_worker_id" : 32,
		"factory_id" : 1,
		"order_id" : 7,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9a2e0a48-3491-4d8c-9164-0c92a7bfa978"
	},
	{
		"order_worker_id" : 33,
		"factory_id" : 1,
		"order_id" : 7,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "38174586-6b40-4d31-86a0-2951ff217189"
	},
	{
		"order_worker_id" : 34,
		"factory_id" : 1,
		"order_id" : 7,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d77078a9-2db0-44c6-991d-efbd2ad9076e"
	},
	{
		"order_worker_id" : 35,
		"factory_id" : 1,
		"order_id" : 7,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0ab954c0-f110-46aa-abd8-e91b01565e07"
	},
	{
		"order_worker_id" : 36,
		"factory_id" : 1,
		"order_id" : 8,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9ee15c1b-1dbd-4c5d-b512-d283574d18b7"
	},
	{
		"order_worker_id" : 37,
		"factory_id" : 1,
		"order_id" : 8,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fa3d7eef-6efd-4a27-a5a3-c0e53a11fbcf"
	},
	{
		"order_worker_id" : 38,
		"factory_id" : 1,
		"order_id" : 8,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3aa635bd-ad0b-43d8-a0f4-351b6d9556cf"
	},
	{
		"order_worker_id" : 39,
		"factory_id" : 1,
		"order_id" : 8,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8f495980-7745-406f-9499-3c46fc72e453"
	},
	{
		"order_worker_id" : 40,
		"factory_id" : 1,
		"order_id" : 8,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ec470b3f-bc14-4764-bf2c-561e079c81f9"
	},
	{
		"order_worker_id" : 41,
		"factory_id" : 1,
		"order_id" : 9,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b500751e-31ea-47c9-b799-7e3361601b86"
	},
	{
		"order_worker_id" : 42,
		"factory_id" : 1,
		"order_id" : 9,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b3d6c8cf-0f7a-461f-906c-e3cdcc44f5d2"
	},
	{
		"order_worker_id" : 43,
		"factory_id" : 1,
		"order_id" : 9,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0a9a8b80-5830-47ac-9b44-070520b3a2cf"
	},
	{
		"order_worker_id" : 44,
		"factory_id" : 1,
		"order_id" : 9,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1eeee469-2455-4158-b346-9dd0ac313bcd"
	},
	{
		"order_worker_id" : 45,
		"factory_id" : 1,
		"order_id" : 9,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7ac00236-b7e1-4d20-8f30-8e3278c0400e"
	},
	{
		"order_worker_id" : 46,
		"factory_id" : 1,
		"order_id" : 10,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3505c602-f22b-4667-a699-29963e1c0d3b"
	},
	{
		"order_worker_id" : 47,
		"factory_id" : 1,
		"order_id" : 10,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "34bec155-c971-448e-a58c-00a48390cb33"
	},
	{
		"order_worker_id" : 48,
		"factory_id" : 1,
		"order_id" : 10,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "51b265e1-c44c-4945-b892-3c06d1592669"
	},
	{
		"order_worker_id" : 49,
		"factory_id" : 1,
		"order_id" : 10,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f458d231-8a60-4dd1-9b4e-b77b894163f2"
	},
	{
		"order_worker_id" : 50,
		"factory_id" : 1,
		"order_id" : 10,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "645f3e7f-b027-4786-8a0c-a6550c4ab60e"
	},
	{
		"order_worker_id" : 51,
		"factory_id" : 1,
		"order_id" : 11,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d13ddcad-242d-46fa-b494-0faebfae9afe"
	},
	{
		"order_worker_id" : 52,
		"factory_id" : 1,
		"order_id" : 11,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "34db2d0c-bb32-4704-b607-5734225b609f"
	},
	{
		"order_worker_id" : 53,
		"factory_id" : 1,
		"order_id" : 11,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b8bfb651-e722-419d-907a-80040321fa33"
	},
	{
		"order_worker_id" : 54,
		"factory_id" : 1,
		"order_id" : 11,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2b0be94b-0f58-40b7-8ec0-e9ac1a0fb36e"
	},
	{
		"order_worker_id" : 55,
		"factory_id" : 1,
		"order_id" : 11,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e2b838de-181e-4c21-b195-4a804c858249"
	},
	{
		"order_worker_id" : 56,
		"factory_id" : 1,
		"order_id" : 12,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4ebcccb6-c1ec-4c12-91f8-29776292e4ab"
	},
	{
		"order_worker_id" : 57,
		"factory_id" : 1,
		"order_id" : 12,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "90ca4555-213c-4943-ba46-3e3bb192a128"
	},
	{
		"order_worker_id" : 58,
		"factory_id" : 1,
		"order_id" : 12,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "51fb1610-4d34-49bd-859b-4353ee815560"
	},
	{
		"order_worker_id" : 59,
		"factory_id" : 1,
		"order_id" : 12,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "789882ea-0f44-4a6b-b643-c2e9f3844000"
	},
	{
		"order_worker_id" : 60,
		"factory_id" : 1,
		"order_id" : 12,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "11e0b2fe-bbbe-426d-8694-85714312450a"
	},
	{
		"order_worker_id" : 61,
		"factory_id" : 1,
		"order_id" : 13,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0c6fb79d-5d12-4aee-a915-86e694d52412"
	},
	{
		"order_worker_id" : 62,
		"factory_id" : 1,
		"order_id" : 13,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "03b118e4-3dae-4b5a-8f94-c87a95dbcb15"
	},
	{
		"order_worker_id" : 63,
		"factory_id" : 1,
		"order_id" : 13,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a3dfff2e-cb1b-4384-9931-136b79289e28"
	},
	{
		"order_worker_id" : 64,
		"factory_id" : 1,
		"order_id" : 13,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "319b2e79-31d6-41b5-809e-18fc2fa3a6fa"
	},
	{
		"order_worker_id" : 65,
		"factory_id" : 1,
		"order_id" : 13,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "90ab6b4b-1260-4e46-ad53-44f7fe0bc98a"
	},
	{
		"order_worker_id" : 66,
		"factory_id" : 1,
		"order_id" : 14,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2efdfe3d-7fc9-4efe-b000-34e5f375301a"
	},
	{
		"order_worker_id" : 67,
		"factory_id" : 1,
		"order_id" : 14,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b1442bc3-29d7-48d4-a733-7dbe98a8a583"
	},
	{
		"order_worker_id" : 68,
		"factory_id" : 1,
		"order_id" : 14,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7094d4ee-67f3-4408-9f7f-25f6115dbba4"
	},
	{
		"order_worker_id" : 69,
		"factory_id" : 1,
		"order_id" : 14,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2dad5592-391f-4ea0-bc33-728ee55aeda7"
	},
	{
		"order_worker_id" : 70,
		"factory_id" : 1,
		"order_id" : 14,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f72622e3-3115-478d-b97e-0e542735ea2c"
	},
	{
		"order_worker_id" : 71,
		"factory_id" : 1,
		"order_id" : 15,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2f0ba0ba-4faa-4a86-9c83-f144daa21261"
	},
	{
		"order_worker_id" : 72,
		"factory_id" : 1,
		"order_id" : 15,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "756127f9-78de-4f6f-b3a8-97c90e28dfd4"
	},
	{
		"order_worker_id" : 73,
		"factory_id" : 1,
		"order_id" : 15,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1073e75d-9f4e-4489-b325-0fb77f2b7cf0"
	},
	{
		"order_worker_id" : 74,
		"factory_id" : 1,
		"order_id" : 15,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "dc0e2f79-b171-422c-be97-8256b8b5b3e3"
	},
	{
		"order_worker_id" : 75,
		"factory_id" : 1,
		"order_id" : 15,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "94a88e59-8cd3-4416-ad32-dc779a596945"
	},
	{
		"order_worker_id" : 76,
		"factory_id" : 1,
		"order_id" : 16,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "40da63d5-2139-48a4-b7e4-aa945961319d"
	},
	{
		"order_worker_id" : 77,
		"factory_id" : 1,
		"order_id" : 16,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "91d4fb02-d7ca-42b7-96df-096f3088d147"
	},
	{
		"order_worker_id" : 78,
		"factory_id" : 1,
		"order_id" : 16,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a29a48e1-132e-4ff4-b1f9-f388eb50a3a4"
	},
	{
		"order_worker_id" : 79,
		"factory_id" : 1,
		"order_id" : 16,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1eb63425-cfd5-40f7-9409-d99bc59ed09f"
	},
	{
		"order_worker_id" : 80,
		"factory_id" : 1,
		"order_id" : 16,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "97d1952b-7b48-44d6-bcd5-e9b445ab7757"
	},
	{
		"order_worker_id" : 81,
		"factory_id" : 1,
		"order_id" : 17,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "55d588f4-3f51-4a75-82f5-5ba41cb70432"
	},
	{
		"order_worker_id" : 82,
		"factory_id" : 1,
		"order_id" : 17,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "53b03315-a670-4821-bd13-788af06d3ea5"
	},
	{
		"order_worker_id" : 83,
		"factory_id" : 1,
		"order_id" : 17,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "20788de4-7d0a-4f11-9ff0-def69bbb837d"
	},
	{
		"order_worker_id" : 84,
		"factory_id" : 1,
		"order_id" : 17,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1efc8908-f15d-40cd-994e-6fcd23639929"
	},
	{
		"order_worker_id" : 85,
		"factory_id" : 1,
		"order_id" : 17,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3176e3b7-12f0-4099-8a53-c691b52dceef"
	},
	{
		"order_worker_id" : 86,
		"factory_id" : 1,
		"order_id" : 18,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a795a266-db31-4cc4-9b8b-c82b5e237693"
	},
	{
		"order_worker_id" : 87,
		"factory_id" : 1,
		"order_id" : 18,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e3d1ad1a-9bf5-4f78-a457-fe733c5ef484"
	},
	{
		"order_worker_id" : 88,
		"factory_id" : 1,
		"order_id" : 18,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "003c9581-2063-474b-bd1a-1df18ff0289e"
	},
	{
		"order_worker_id" : 89,
		"factory_id" : 1,
		"order_id" : 18,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "83268a70-a807-4308-8909-c103f19cd6f5"
	},
	{
		"order_worker_id" : 90,
		"factory_id" : 1,
		"order_id" : 18,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0091af0d-b93d-40a0-90b2-7f9596188eb9"
	},
	{
		"order_worker_id" : 91,
		"factory_id" : 1,
		"order_id" : 19,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ea07718d-ed27-46e5-8222-307162ba2293"
	},
	{
		"order_worker_id" : 92,
		"factory_id" : 1,
		"order_id" : 19,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "095ef5eb-33d8-41b6-8be8-eccbe7ae58fc"
	},
	{
		"order_worker_id" : 93,
		"factory_id" : 1,
		"order_id" : 19,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "46534b1e-99c7-49ba-ab8e-90939200e7bb"
	},
	{
		"order_worker_id" : 94,
		"factory_id" : 1,
		"order_id" : 19,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6b8ed8c2-8845-44d8-8291-408d942d994a"
	},
	{
		"order_worker_id" : 95,
		"factory_id" : 1,
		"order_id" : 19,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e31e77d0-1112-432d-b3d1-7400247241f6"
	},
	{
		"order_worker_id" : 96,
		"factory_id" : 1,
		"order_id" : 20,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d69d6c28-ff7f-4fd5-8bb6-0b8f1d48a00b"
	},
	{
		"order_worker_id" : 97,
		"factory_id" : 1,
		"order_id" : 20,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e65a5b5c-52c9-451a-9cde-10f0f0cedce2"
	},
	{
		"order_worker_id" : 98,
		"factory_id" : 1,
		"order_id" : 20,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "863eeaca-f88c-4e7a-ae09-8fbde6ceba3e"
	},
	{
		"order_worker_id" : 99,
		"factory_id" : 1,
		"order_id" : 20,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8b79a62d-0194-4783-af0a-126e434c3b5f"
	},
	{
		"order_worker_id" : 100,
		"factory_id" : 1,
		"order_id" : 20,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b95351ce-a8d4-4a4f-823f-a8058012a272"
	},
	{
		"order_worker_id" : 101,
		"factory_id" : 1,
		"order_id" : 21,
		"worker_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5a364d55-6ad8-478a-81c7-f711b539b84c"
	},
	{
		"order_worker_id" : 102,
		"factory_id" : 1,
		"order_id" : 21,
		"worker_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ef06c4e2-f2a1-4b13-aad4-3de9459a68e4"
	},
	{
		"order_worker_id" : 103,
		"factory_id" : 1,
		"order_id" : 21,
		"worker_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3c6d1554-54df-410b-8093-efbd041d4747"
	},
	{
		"order_worker_id" : 104,
		"factory_id" : 1,
		"order_id" : 21,
		"worker_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "39bfb0fe-5e75-4966-a271-2cd7c420b628"
	},
	{
		"order_worker_id" : 105,
		"factory_id" : 1,
		"order_id" : 21,
		"worker_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0547e8a7-8eb3-4017-8232-ba01a6198fe5"
	}
];

const baseMigration = new BaseMigration('PrdOrderWorker', 'order_worker_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };