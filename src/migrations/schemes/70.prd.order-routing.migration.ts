import IPrdOrderRouting from '../../interfaces/prd/order-routing.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IPrdOrderRouting[] = [
  {
		"order_routing_id" : 1,
		"factory_id" : 1,
		"order_id" : 1,
		"proc_id" : 3,
		"proc_no" : 10,
		"workings_id" : 3,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f18ac705-48b6-4340-bdf1-e730e11a3214"
	},
	{
		"order_routing_id" : 2,
		"factory_id" : 1,
		"order_id" : 2,
		"proc_id" : 3,
		"proc_no" : 10,
		"workings_id" : 4,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c3e66382-d36d-46f1-baed-20197476faeb"
	},
	{
		"order_routing_id" : 3,
		"factory_id" : 1,
		"order_id" : 3,
		"proc_id" : 3,
		"proc_no" : 10,
		"workings_id" : 5,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "747e3ea5-84a0-4e70-93c0-0b7d4fb349df"
	},
	{
		"order_routing_id" : 4,
		"factory_id" : 1,
		"order_id" : 4,
		"proc_id" : 1,
		"proc_no" : 10,
		"workings_id" : 3,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1f94cd94-7524-4fe0-8fdf-00dec138f0fd"
	},
	{
		"order_routing_id" : 5,
		"factory_id" : 1,
		"order_id" : 5,
		"proc_id" : 1,
		"proc_no" : 10,
		"workings_id" : 1,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a8c617bc-60be-4ca1-b726-15f01820dcbe"
	},
	{
		"order_routing_id" : 6,
		"factory_id" : 1,
		"order_id" : 7,
		"proc_id" : 2,
		"proc_no" : 10,
		"workings_id" : 5,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5cb9ad75-94d4-4187-9c9b-c283745380d1"
	},
	{
		"order_routing_id" : 7,
		"factory_id" : 1,
		"order_id" : 8,
		"proc_id" : 3,
		"proc_no" : 10,
		"workings_id" : 3,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e94f9d2e-3172-4b3f-9c3a-cb88e400efad"
	},
	{
		"order_routing_id" : 8,
		"factory_id" : 1,
		"order_id" : 9,
		"proc_id" : 3,
		"proc_no" : 10,
		"workings_id" : 5,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "dd5c11e7-dc3e-4607-96ac-0c386e680ab4"
	},
	{
		"order_routing_id" : 9,
		"factory_id" : 1,
		"order_id" : 10,
		"proc_id" : 2,
		"proc_no" : 10,
		"workings_id" : 4,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9c941fc2-ffe0-4983-ac9e-083b1b503b2b"
	},
	{
		"order_routing_id" : 10,
		"factory_id" : 1,
		"order_id" : 12,
		"proc_id" : 2,
		"proc_no" : 10,
		"workings_id" : 2,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "aba0ff8e-d955-4194-97d6-79620e0ecd4b"
	},
	{
		"order_routing_id" : 11,
		"factory_id" : 1,
		"order_id" : 13,
		"proc_id" : 2,
		"proc_no" : 10,
		"workings_id" : 1,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6e1a1c41-97f1-44c0-8bb7-42e2006665ab"
	},
	{
		"order_routing_id" : 12,
		"factory_id" : 1,
		"order_id" : 14,
		"proc_id" : 3,
		"proc_no" : 10,
		"workings_id" : 3,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7a3fcf25-60ba-4ba9-9421-e0063c3bca4b"
	},
	{
		"order_routing_id" : 13,
		"factory_id" : 1,
		"order_id" : 15,
		"proc_id" : 3,
		"proc_no" : 10,
		"workings_id" : 5,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d3d8908a-4f70-4f59-85f5-ca2a036a6bbe"
	},
	{
		"order_routing_id" : 14,
		"factory_id" : 1,
		"order_id" : 16,
		"proc_id" : 2,
		"proc_no" : 10,
		"workings_id" : 5,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3b200cee-05a3-4551-a311-267eb8ab67a8"
	},
	{
		"order_routing_id" : 15,
		"factory_id" : 1,
		"order_id" : 17,
		"proc_id" : 3,
		"proc_no" : 10,
		"workings_id" : 5,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ee0eef87-0d28-463f-afdc-aa0fd7091b1d"
	},
	{
		"order_routing_id" : 16,
		"factory_id" : 1,
		"order_id" : 18,
		"proc_id" : 3,
		"proc_no" : 10,
		"workings_id" : 5,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "78327d40-4f13-43e7-901e-7861a6fcc7b5"
	},
	{
		"order_routing_id" : 17,
		"factory_id" : 1,
		"order_id" : 19,
		"proc_id" : 3,
		"proc_no" : 10,
		"workings_id" : 4,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bde6ee81-b1e9-4586-9d8c-a5f149690b4f"
	},
	{
		"order_routing_id" : 18,
		"factory_id" : 1,
		"order_id" : 20,
		"proc_id" : 3,
		"proc_no" : 10,
		"workings_id" : 3,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "625ed7dc-efa4-4483-a484-8c7efdf2b301"
	},
	{
		"order_routing_id" : 19,
		"factory_id" : 1,
		"order_id" : 21,
		"proc_id" : 2,
		"proc_no" : 20,
		"workings_id" : 3,
		"equip_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d3226c25-49bb-4cc9-ae0e-de81a94ca118"
	}
];

const baseMigration = new BaseMigration('PrdOrderRouting', 'order_routing_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };