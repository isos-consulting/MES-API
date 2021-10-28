import IPrdOrderInput from '../../interfaces/prd/order-input.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdOrderInput[] = [
  {
		"order_input_id" : 1,
		"factory_id" : 1,
		"order_id" : 1,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1ee6ce49-8be0-40ca-8225-c288b9bcd26a"
	},
	{
		"order_input_id" : 2,
		"factory_id" : 1,
		"order_id" : 1,
		"prod_id" : 10,
		"c_usage" : 0.200000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "93fcd56c-ee22-41f6-a601-87ba17c346cb"
	},
	{
		"order_input_id" : 3,
		"factory_id" : 1,
		"order_id" : 1,
		"prod_id" : 11,
		"c_usage" : 0.500000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4989acbe-9fdc-426e-b3c3-d24e9240cc44"
	},
	{
		"order_input_id" : 4,
		"factory_id" : 1,
		"order_id" : 2,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ab58f74f-b963-4d94-b55d-634009927ccc"
	},
	{
		"order_input_id" : 5,
		"factory_id" : 1,
		"order_id" : 2,
		"prod_id" : 10,
		"c_usage" : 0.200000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f897dab7-99fa-459a-b61c-77246e021842"
	},
	{
		"order_input_id" : 6,
		"factory_id" : 1,
		"order_id" : 2,
		"prod_id" : 11,
		"c_usage" : 0.500000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "dd3d0501-1da6-4e8e-b8c4-1250332b101b"
	},
	{
		"order_input_id" : 7,
		"factory_id" : 1,
		"order_id" : 3,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6bb7cfa4-25e6-4cac-bf55-666a18c31548"
	},
	{
		"order_input_id" : 8,
		"factory_id" : 1,
		"order_id" : 3,
		"prod_id" : 10,
		"c_usage" : 0.200000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "33b44f21-3460-495d-bfa0-c2b923800b6e"
	},
	{
		"order_input_id" : 9,
		"factory_id" : 1,
		"order_id" : 3,
		"prod_id" : 11,
		"c_usage" : 0.500000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9b997cb4-5469-4ea0-aea1-4c10adbb55f0"
	},
	{
		"order_input_id" : 10,
		"factory_id" : 1,
		"order_id" : 4,
		"prod_id" : 14,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : 1,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4598805f-37fb-4304-ba67-2619a4978083"
	},
	{
		"order_input_id" : 11,
		"factory_id" : 1,
		"order_id" : 4,
		"prod_id" : 15,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : 1,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b123d28f-421c-4747-bd97-2bd0ce8bed14"
	},
	{
		"order_input_id" : 12,
		"factory_id" : 1,
		"order_id" : 4,
		"prod_id" : 13,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : 1,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cf2ce017-9b23-4dda-a20e-93603f52afba"
	},
	{
		"order_input_id" : 13,
		"factory_id" : 1,
		"order_id" : 4,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : 1,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "340e7fc1-3876-4c50-b75b-18c89deaf74f"
	},
	{
		"order_input_id" : 14,
		"factory_id" : 1,
		"order_id" : 5,
		"prod_id" : 14,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cb904037-10cf-43f3-8934-52cd252afff6"
	},
	{
		"order_input_id" : 15,
		"factory_id" : 1,
		"order_id" : 5,
		"prod_id" : 15,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8ec43198-b420-4c7d-a916-218f8c9b0e12"
	},
	{
		"order_input_id" : 16,
		"factory_id" : 1,
		"order_id" : 5,
		"prod_id" : 13,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7df498ab-5a34-4014-82da-de4b72bb5e83"
	},
	{
		"order_input_id" : 17,
		"factory_id" : 1,
		"order_id" : 5,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ac9a8ede-12e3-46f6-81f5-ec9530fc4d49"
	},
	{
		"order_input_id" : 18,
		"factory_id" : 1,
		"order_id" : 6,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "34dbd2ef-1348-40ab-84b2-aa50fedf11b7"
	},
	{
		"order_input_id" : 19,
		"factory_id" : 1,
		"order_id" : 6,
		"prod_id" : 15,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cbaf50dd-f4a4-4a23-b5ff-398d031a1f6b"
	},
	{
		"order_input_id" : 20,
		"factory_id" : 1,
		"order_id" : 6,
		"prod_id" : 13,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5011b043-a989-4092-880b-5efb958033df"
	},
	{
		"order_input_id" : 21,
		"factory_id" : 1,
		"order_id" : 6,
		"prod_id" : 14,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e1c68079-1732-406f-a97b-2e57331a4d75"
	},
	{
		"order_input_id" : 22,
		"factory_id" : 1,
		"order_id" : 7,
		"prod_id" : 9,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f4e2d1bf-eebb-4427-bccb-2b6ad67ae6ef"
	},
	{
		"order_input_id" : 23,
		"factory_id" : 1,
		"order_id" : 7,
		"prod_id" : 8,
		"c_usage" : 2.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "38f72ed2-6147-4572-96b4-e8e0a89beb61"
	},
	{
		"order_input_id" : 24,
		"factory_id" : 1,
		"order_id" : 7,
		"prod_id" : 6,
		"c_usage" : 4.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "41855c7e-e849-40b9-9e7e-679abd771606"
	},
	{
		"order_input_id" : 25,
		"factory_id" : 1,
		"order_id" : 8,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "73f8d95e-72e0-4030-a2b3-308dedbb77ea"
	},
	{
		"order_input_id" : 26,
		"factory_id" : 1,
		"order_id" : 8,
		"prod_id" : 10,
		"c_usage" : 0.200000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "89b54c9c-6aa4-4aae-ab0e-942023c7ce25"
	},
	{
		"order_input_id" : 27,
		"factory_id" : 1,
		"order_id" : 8,
		"prod_id" : 11,
		"c_usage" : 0.500000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "dc9caf34-e809-427c-b84c-014bae6ebdcb"
	},
	{
		"order_input_id" : 28,
		"factory_id" : 1,
		"order_id" : 9,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1cf23c66-46f0-4706-a2ae-639d3594bf11"
	},
	{
		"order_input_id" : 29,
		"factory_id" : 1,
		"order_id" : 9,
		"prod_id" : 10,
		"c_usage" : 0.200000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "aff89863-b518-4527-a35f-d328215bb046"
	},
	{
		"order_input_id" : 30,
		"factory_id" : 1,
		"order_id" : 9,
		"prod_id" : 11,
		"c_usage" : 0.500000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "52815ade-434d-494d-9b0d-00e7a23350a6"
	},
	{
		"order_input_id" : 31,
		"factory_id" : 1,
		"order_id" : 10,
		"prod_id" : 9,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2c386c41-7546-4217-ac8b-8c35d0f30106"
	},
	{
		"order_input_id" : 32,
		"factory_id" : 1,
		"order_id" : 10,
		"prod_id" : 8,
		"c_usage" : 2.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6025fb61-d3a8-40eb-aa8d-8e95b212cfb9"
	},
	{
		"order_input_id" : 33,
		"factory_id" : 1,
		"order_id" : 10,
		"prod_id" : 6,
		"c_usage" : 4.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1b953b12-66fd-4499-8690-167e6fdf0b70"
	},
	{
		"order_input_id" : 34,
		"factory_id" : 1,
		"order_id" : 11,
		"prod_id" : 7,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6ba9fc83-ecaa-4041-be3f-67239a4d3864"
	},
	{
		"order_input_id" : 35,
		"factory_id" : 1,
		"order_id" : 12,
		"prod_id" : 16,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "67c16fcf-a6e0-412f-947e-db581c801d8f"
	},
	{
		"order_input_id" : 36,
		"factory_id" : 1,
		"order_id" : 12,
		"prod_id" : 17,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "20cfc1d6-9edc-4ae5-aa1c-8e84b6e8588e"
	},
	{
		"order_input_id" : 37,
		"factory_id" : 1,
		"order_id" : 12,
		"prod_id" : 18,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3fa1c59d-deb2-484d-b016-b968f492f04f"
	},
	{
		"order_input_id" : 38,
		"factory_id" : 1,
		"order_id" : 13,
		"prod_id" : 16,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "daf83a4a-84d7-4483-a8f3-fb2130211e4d"
	},
	{
		"order_input_id" : 39,
		"factory_id" : 1,
		"order_id" : 13,
		"prod_id" : 17,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "88dabfc1-8e38-4cea-b3d0-e8ff5bc53912"
	},
	{
		"order_input_id" : 40,
		"factory_id" : 1,
		"order_id" : 13,
		"prod_id" : 18,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0dea49f3-ecb4-45e4-850a-a04a44fb3626"
	},
	{
		"order_input_id" : 41,
		"factory_id" : 1,
		"order_id" : 14,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "130145c8-0e9c-470f-8666-697de3d12d4c"
	},
	{
		"order_input_id" : 42,
		"factory_id" : 1,
		"order_id" : 14,
		"prod_id" : 10,
		"c_usage" : 0.200000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d766481a-9e70-418d-98f0-f15e993c5863"
	},
	{
		"order_input_id" : 43,
		"factory_id" : 1,
		"order_id" : 14,
		"prod_id" : 11,
		"c_usage" : 0.500000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1e302f23-d9db-4317-8877-58febd3e26e8"
	},
	{
		"order_input_id" : 44,
		"factory_id" : 1,
		"order_id" : 15,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c8be6cd5-1305-4c47-8363-2cb2ba208ee1"
	},
	{
		"order_input_id" : 45,
		"factory_id" : 1,
		"order_id" : 15,
		"prod_id" : 10,
		"c_usage" : 0.200000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "89b20fc2-62f5-486d-842d-90d3708928cd"
	},
	{
		"order_input_id" : 46,
		"factory_id" : 1,
		"order_id" : 15,
		"prod_id" : 11,
		"c_usage" : 0.500000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "efa3caee-c5ac-402c-8a78-d636e25c1df3"
	},
	{
		"order_input_id" : 47,
		"factory_id" : 1,
		"order_id" : 16,
		"prod_id" : 9,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "17f09c65-90c8-4b1c-9dae-876b0147cf3c"
	},
	{
		"order_input_id" : 48,
		"factory_id" : 1,
		"order_id" : 16,
		"prod_id" : 8,
		"c_usage" : 2.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ec98ae0d-c361-464a-b40d-27ccb2b29a45"
	},
	{
		"order_input_id" : 49,
		"factory_id" : 1,
		"order_id" : 16,
		"prod_id" : 6,
		"c_usage" : 4.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3dc27733-adc6-44a4-89b4-f9fbba7ff2b0"
	},
	{
		"order_input_id" : 50,
		"factory_id" : 1,
		"order_id" : 17,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : 1,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b4e79584-14dd-4caa-b6bc-15748decf718"
	},
	{
		"order_input_id" : 51,
		"factory_id" : 1,
		"order_id" : 17,
		"prod_id" : 10,
		"c_usage" : 0.200000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : 1,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4c256075-1b99-428a-86ec-67dae926b744"
	},
	{
		"order_input_id" : 52,
		"factory_id" : 1,
		"order_id" : 17,
		"prod_id" : 11,
		"c_usage" : 0.500000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : 1,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "587086cd-9384-4ab2-b7f0-bdb37ac1fdd6"
	},
	{
		"order_input_id" : 53,
		"factory_id" : 1,
		"order_id" : 18,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "20763381-2857-4c62-9db8-5cb53122cd7e"
	},
	{
		"order_input_id" : 54,
		"factory_id" : 1,
		"order_id" : 18,
		"prod_id" : 10,
		"c_usage" : 0.200000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "eb1dc257-5277-48a9-9f1a-397ff20febc0"
	},
	{
		"order_input_id" : 55,
		"factory_id" : 1,
		"order_id" : 18,
		"prod_id" : 11,
		"c_usage" : 0.500000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2a0fb886-60a7-423b-a939-a56547b11314"
	},
	{
		"order_input_id" : 56,
		"factory_id" : 1,
		"order_id" : 19,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "6ffafa2a-bfc4-416a-9ae6-895392e085c9"
	},
	{
		"order_input_id" : 57,
		"factory_id" : 1,
		"order_id" : 19,
		"prod_id" : 10,
		"c_usage" : 0.200000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "58b51e41-7ccd-4710-8a6c-a022affdf0e4"
	},
	{
		"order_input_id" : 58,
		"factory_id" : 1,
		"order_id" : 19,
		"prod_id" : 11,
		"c_usage" : 0.500000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "42ebc66e-c579-4421-b6c8-9ba1bb48ffde"
	},
	{
		"order_input_id" : 59,
		"factory_id" : 1,
		"order_id" : 20,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a728d438-ca79-4bbd-9008-221d6fbd1ac5"
	},
	{
		"order_input_id" : 60,
		"factory_id" : 1,
		"order_id" : 20,
		"prod_id" : 10,
		"c_usage" : 0.200000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a53b4efb-3c34-422e-8021-60a62fb3963c"
	},
	{
		"order_input_id" : 61,
		"factory_id" : 1,
		"order_id" : 20,
		"prod_id" : 11,
		"c_usage" : 0.500000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8052bcf6-2a48-4bee-a0bd-438dbe183f0a"
	},
	{
		"order_input_id" : 62,
		"factory_id" : 1,
		"order_id" : 21,
		"prod_id" : 7,
		"c_usage" : 2.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ba9733ae-fe44-4ccb-be70-55b06e2bb50e"
	},
	{
		"order_input_id" : 63,
		"factory_id" : 1,
		"order_id" : 21,
		"prod_id" : 6,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8e8eb839-be02-4d6d-a341-930f3683f3ff"
	},
	{
		"order_input_id" : 64,
		"factory_id" : 1,
		"order_id" : 21,
		"prod_id" : 16,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9ce9f07c-8b6a-486a-b986-527e04e722e7"
	},
	{
		"order_input_id" : 65,
		"factory_id" : 1,
		"order_id" : 21,
		"prod_id" : 10,
		"c_usage" : 1.000000,
		"unit_id" : 5,
		"from_store_id" : 1,
		"from_location_id" : null,
		"remark" : null,
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ccde35dc-6421-4b5b-bfc8-dfe85a8a59ef"
	}
];

const baseMigration = new BaseMigration('PrdOrderInput', 'order_input_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };