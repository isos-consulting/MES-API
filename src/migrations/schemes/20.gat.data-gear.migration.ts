import IStdDataGear from '../../interfaces/gat/data-gear.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdDataGear[] = [
	{
		data_gear_id : 1,
		ip : "192.168.219.100",
		port : "502",
		gear_type : "GR200",
		connection_type : "TCP\/IP",
		factory_id : 1,
		data_gear_cd : "01",
		data_gear_nm : "GR200",
		created_uid : 0,
		updated_uid : 0,
		uuid : "fc34488a-6c2e-436c-86b0-0c1abfcb9a4f",
		manufacturer : "Autonics",
		protocol : "MODBUS"
	},
	{
		data_gear_id : 5,
		ip : "192.168.0.177",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "001",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "d1c3d726-501f-479b-8b7b-5720f79c71f0",
		manufacturer : null,
		protocol : null
	},
	{
		data_gear_id : 6,
		ip : "192.168.0.171",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "002",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "ee01f5e5-cf1a-49da-9cd2-4800293296b8",
		manufacturer : null,
		protocol : null
	},
	{
		data_gear_id : 7,
		ip : "192.168.0.172",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "003",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "0f3bc6cd-f750-4f77-a881-734285913d5e",
		manufacturer : null,
		protocol : null
	},
	{
		data_gear_id : 8,
		ip : "192.168.0.173",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "004",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "c04a3115-b62e-4015-afdf-4fed899556df",
		manufacturer : null,
		protocol : null
	},
	{
		data_gear_id : 9,
		ip : "192.168.0.174",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "005",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "e579196b-1e29-4d92-b6a4-4e100b56719d",
		manufacturer : null,
		protocol : null
	},
	{
		data_gear_id : 10,
		ip : "192.168.0.175",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "006",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "24eaca27-33f7-49b4-98e5-8d50d0ba91ee",
		manufacturer : null,
		protocol : null
	},
	{
		data_gear_id : 11,
		ip : "192.168.0.176",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "007",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "2230e70d-82d2-4ca3-b857-df76bbce3264",
		manufacturer : null,
		protocol : null
	},
	{
		data_gear_id : 12,
		ip : "192.168.0.165",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "008",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "8471b698-863c-4edb-93cd-e06476c8e8bf",
		manufacturer : null,
		protocol : null
	},
	{
		data_gear_id : 13,
		ip : "192.168.0.166",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "009",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "aad7d6ee-2d9b-473c-abcc-a2c33cfbd851",
		manufacturer : null,
		protocol : null
	},
	{
		data_gear_id : 14,
		ip : "192.168.0.167",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "010",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "29de8169-7ce2-4605-8368-bd5b77f6a974",
		manufacturer : null,
		protocol : null
	},
	{
		data_gear_id : 15,
		ip : "192.168.0.169",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "011",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "58bfbb2f-f676-4e78-b2bb-e8a557df2356",
		manufacturer : null,
		protocol : null
	},
	{
		data_gear_id : 16,
		ip : "192.168.0.170",
		port : "5051",
		gear_type : "NETEYE",
		connection_type : "Ethernet",
		factory_id : 1,
		data_gear_cd : "012",
		data_gear_nm : "NETEYE",
		created_uid : 0,
		updated_uid : 0,
		uuid : "b2d86b25-1f4e-4a91-a748-756f601e85c8",
		manufacturer : null,
		protocol : null
	}
]

const baseMigration = new BaseMigration('StdDataGear', 'data_gear_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };