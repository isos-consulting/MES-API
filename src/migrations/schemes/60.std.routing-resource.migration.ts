import IStdRoutingResource from '../../interfaces/std/routing-resource.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdRoutingResource[] = [
  {
		"routing_resource_id" : 1,
		"factory_id" : 1,
		"routing_id" : 1,
		"emp_cnt" : 2,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d93e7767-f289-459e-a6a5-ef8a4d282a69"
	},
	{
		"routing_resource_id" : 2,
		"factory_id" : 1,
		"routing_id" : 3,
		"emp_cnt" : 1,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c3fe72f6-ad30-48d6-a8f4-dd9844b1b034"
	},
	{
		"routing_resource_id" : 3,
		"factory_id" : 1,
		"routing_id" : 4,
		"emp_cnt" : 2,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "91d81a2c-bf97-468d-a92b-154a2ba8160d"
	},
	{
		"routing_resource_id" : 4,
		"factory_id" : 1,
		"routing_id" : 4,
		"emp_cnt" : 2,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6e259ff5-dbd5-4829-8ace-781d898e4526"
	},
	{
		"routing_resource_id" : 5,
		"factory_id" : 1,
		"routing_id" : 2,
		"emp_cnt" : 1,
		"cycle_time" : 1.000000,
		"uph" : 1.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "984f5837-7d3b-478e-9e94-7e3b4fb6f694"
	},
	{
		"routing_resource_id" : 6,
		"factory_id" : 1,
		"routing_id" : 5,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5ab57e34-85ac-40c8-8421-d3ec7f07642d"
	},
	{
		"routing_resource_id" : 7,
		"factory_id" : 1,
		"routing_id" : 6,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "11bc9bf3-c057-4cbd-971e-d9944f7caebc"
	},
	{
		"routing_resource_id" : 8,
		"factory_id" : 1,
		"routing_id" : 7,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "31d17f53-448c-41e9-911d-2455b81b81b6"
	},
	{
		"routing_resource_id" : 9,
		"factory_id" : 1,
		"routing_id" : 8,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7dfd0599-5e71-4ddd-8e0b-e7d1dbf0b56a"
	},
	{
		"routing_resource_id" : 10,
		"factory_id" : 1,
		"routing_id" : 9,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "377bad4e-dfbc-4066-a1f0-dcaa147809d6"
	},
	{
		"routing_resource_id" : 11,
		"factory_id" : 1,
		"routing_id" : 26,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "13d9fffb-46fc-4fb3-af42-c214fd579efc"
	},
	{
		"routing_resource_id" : 12,
		"factory_id" : 1,
		"routing_id" : 27,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f96d0723-dbde-46d3-b5aa-61aad80716f2"
	},
	{
		"routing_resource_id" : 13,
		"factory_id" : 1,
		"routing_id" : 28,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9b34797d-2ab0-4966-911f-accc29bdd8d6"
	},
	{
		"routing_resource_id" : 14,
		"factory_id" : 1,
		"routing_id" : 10,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a9ae4b81-39dc-4dd3-b0cb-3703b39760d3"
	},
	{
		"routing_resource_id" : 15,
		"factory_id" : 1,
		"routing_id" : 11,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ddfa6ee1-5aed-4945-95f4-e085bd763b85"
	},
	{
		"routing_resource_id" : 16,
		"factory_id" : 1,
		"routing_id" : 12,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4f9b4339-641d-48ee-9303-cd97d9bafe23"
	},
	{
		"routing_resource_id" : 17,
		"factory_id" : 1,
		"routing_id" : 13,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fce447ac-4db5-4568-b290-c7c0b70bafbf"
	},
	{
		"routing_resource_id" : 18,
		"factory_id" : 1,
		"routing_id" : 15,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c7c384d4-2388-4f77-9a32-f426a14630a0"
	},
	{
		"routing_resource_id" : 19,
		"factory_id" : 1,
		"routing_id" : 14,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "06c56d71-4286-4a6c-8aa3-5b2124b0fd82"
	},
	{
		"routing_resource_id" : 20,
		"factory_id" : 1,
		"routing_id" : 16,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f5227f4c-7b61-4a40-9c1b-f61f5a64aa94"
	},
	{
		"routing_resource_id" : 21,
		"factory_id" : 1,
		"routing_id" : 17,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b7bdd489-38ba-42fb-9fe7-58471163b297"
	},
	{
		"routing_resource_id" : 22,
		"factory_id" : 1,
		"routing_id" : 18,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a21c2c25-662f-4e87-94f5-9b8ef3896dd8"
	},
	{
		"routing_resource_id" : 23,
		"factory_id" : 1,
		"routing_id" : 19,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1378c564-dee5-4fad-8521-9ab669128f6e"
	},
	{
		"routing_resource_id" : 24,
		"factory_id" : 1,
		"routing_id" : 20,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b12c6f12-930d-4095-8105-8dd70f61bf4e"
	},
	{
		"routing_resource_id" : 25,
		"factory_id" : 1,
		"routing_id" : 21,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "18c203fb-eaf6-4936-a6bd-cdcc851752bf"
	},
	{
		"routing_resource_id" : 26,
		"factory_id" : 1,
		"routing_id" : 23,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d97a512d-f076-4ade-95a3-1e1a8703b88f"
	},
	{
		"routing_resource_id" : 27,
		"factory_id" : 1,
		"routing_id" : 22,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c1763d59-cec1-4ac3-a28a-32133a7434ea"
	},
	{
		"routing_resource_id" : 28,
		"factory_id" : 1,
		"routing_id" : 25,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "89dfc720-6fa2-41fd-8bfe-31f4c283c585"
	},
	{
		"routing_resource_id" : 29,
		"factory_id" : 1,
		"routing_id" : 24,
		"emp_cnt" : 0,
		"cycle_time" : 0.000000,
		"uph" : 0.000000,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7f7664f1-20a9-4ce0-90ff-6e4866032752"
	}
]

const baseMigration = new BaseMigration('StdRoutingResource', 'routing_resource_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };