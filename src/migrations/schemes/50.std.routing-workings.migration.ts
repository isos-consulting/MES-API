import IStdRoutingWorkings from '../../interfaces/std/routing-workings.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdRoutingWorkings[] = [
	{
		"routing_workings_id" : 1,
		"factory_id" : 1,
		"prod_id" : 1,
		"workings_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b3efab16-6707-4b33-bd7e-cbcfb9ea16b5"
	},
	{
		"routing_workings_id" : 2,
		"factory_id" : 1,
		"prod_id" : 1,
		"workings_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bb780cd5-f788-4ff5-ab8e-d519bc94223b"
	},
	{
		"routing_workings_id" : 3,
		"factory_id" : 1,
		"prod_id" : 1,
		"workings_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "72b07ec2-8fa6-4421-8ecc-40cd7d389b24"
	},
	{
		"routing_workings_id" : 4,
		"factory_id" : 1,
		"prod_id" : 2,
		"workings_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bb1fbd74-e813-4c04-aa43-4fda9af96b89"
	},
	{
		"routing_workings_id" : 5,
		"factory_id" : 1,
		"prod_id" : 3,
		"workings_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "07108014-202a-43c7-9ace-6e338e7d1b0a"
	},
	{
		"routing_workings_id" : 6,
		"factory_id" : 1,
		"prod_id" : 3,
		"workings_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7980a70f-d1f9-465d-9f36-323b5a001250"
	},
	{
		"routing_workings_id" : 7,
		"factory_id" : 1,
		"prod_id" : 4,
		"workings_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b7d2f497-0106-4573-9204-46226c2f2f6f"
	},
	{
		"routing_workings_id" : 8,
		"factory_id" : 1,
		"prod_id" : 4,
		"workings_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "017458bf-b19d-4874-8c66-ff1a510ac34f"
	},
	{
		"routing_workings_id" : 9,
		"factory_id" : 1,
		"prod_id" : 5,
		"workings_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2f094fe9-4b04-4be3-8ad4-36889c1b41bb"
	},
	{
		"routing_workings_id" : 10,
		"factory_id" : 1,
		"prod_id" : 5,
		"workings_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d15b5fe9-2ba4-4588-bf7c-2837163f89df"
	},
	{
		"routing_workings_id" : 11,
		"factory_id" : 1,
		"prod_id" : 8,
		"workings_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fb70bb16-7fc4-4655-81b4-fcee26048d04"
	},
	{
		"routing_workings_id" : 12,
		"factory_id" : 1,
		"prod_id" : 8,
		"workings_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "723dbef9-a4da-496c-9c98-0fd9563943d3"
	},
	{
		"routing_workings_id" : 13,
		"factory_id" : 1,
		"prod_id" : 9,
		"workings_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7824df18-32f0-4f68-8d30-17a8d2eb3d2b"
	},
	{
		"routing_workings_id" : 14,
		"factory_id" : 1,
		"prod_id" : 9,
		"workings_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "50a7aed5-608e-40f3-8008-cf68244c9144"
	},
	{
		"routing_workings_id" : 15,
		"factory_id" : 1,
		"prod_id" : 10,
		"workings_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5407b57d-fe06-4dc2-a208-f52ebd7c29ad"
	},
	{
		"routing_workings_id" : 16,
		"factory_id" : 1,
		"prod_id" : 10,
		"workings_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c48b536b-0f8e-4651-9548-bd3b9185865f"
	},
	{
		"routing_workings_id" : 17,
		"factory_id" : 1,
		"prod_id" : 11,
		"workings_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2febe1fc-4cfe-4b0b-bcba-bef7cf047d25"
	},
	{
		"routing_workings_id" : 18,
		"factory_id" : 1,
		"prod_id" : 11,
		"workings_id" : 1,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3a5ee563-32da-44e5-9beb-5cce92e2e2c0"
	},
	{
		"routing_workings_id" : 19,
		"factory_id" : 1,
		"prod_id" : 12,
		"workings_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0965f6c2-a4f2-42ed-9477-5e97ec9527ed"
	},
	{
		"routing_workings_id" : 20,
		"factory_id" : 1,
		"prod_id" : 12,
		"workings_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f4499008-20aa-40c2-ac54-20c5614aec4a"
	},
	{
		"routing_workings_id" : 21,
		"factory_id" : 1,
		"prod_id" : 13,
		"workings_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "dd23d530-e06a-41e7-af36-97e8f5e3e4aa"
	},
	{
		"routing_workings_id" : 22,
		"factory_id" : 1,
		"prod_id" : 13,
		"workings_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e197e3bb-4f99-4f70-bd53-2328bb71e84c"
	},
	{
		"routing_workings_id" : 23,
		"factory_id" : 1,
		"prod_id" : 14,
		"workings_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "588cfc67-490a-4136-b4d3-f61d11201c43"
	},
	{
		"routing_workings_id" : 24,
		"factory_id" : 1,
		"prod_id" : 14,
		"workings_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d8447890-cd93-43a5-9518-63afbc5011f8"
	},
	{
		"routing_workings_id" : 25,
		"factory_id" : 1,
		"prod_id" : 14,
		"workings_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6b448d6d-b5fd-4e5d-b2fa-54c63aada76e"
	},
	{
		"routing_workings_id" : 26,
		"factory_id" : 1,
		"prod_id" : 15,
		"workings_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c4af4127-b424-4e7b-be80-584cee5f4b71"
	},
	{
		"routing_workings_id" : 27,
		"factory_id" : 1,
		"prod_id" : 15,
		"workings_id" : 4,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a93791aa-75a7-43f9-8922-55e9791f6b8f"
	},
	{
		"routing_workings_id" : 28,
		"factory_id" : 1,
		"prod_id" : 15,
		"workings_id" : 5,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "38ed4d79-bea7-4fd6-872e-0d093b85713c"
	},
	{
		"routing_workings_id" : 29,
		"factory_id" : 1,
		"prod_id" : 6,
		"workings_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "deeef069-b4bf-48c5-8280-138dc53bb49e"
	},
	{
		"routing_workings_id" : 30,
		"factory_id" : 1,
		"prod_id" : 7,
		"workings_id" : 3,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "277cd529-d999-412e-8be2-04b270c1e85e"
	},
	{
		"routing_workings_id" : 31,
		"factory_id" : 1,
		"prod_id" : 7,
		"workings_id" : 2,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "488a53aa-e5ae-4fd8-b8f8-40b58d0520af"
	}
]

const baseMigration = new BaseMigration('StdRoutingWorkings', 'routing_workings_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };