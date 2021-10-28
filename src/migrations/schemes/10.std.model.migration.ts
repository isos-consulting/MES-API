import IStdModel from '../../interfaces/std/model.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdModel[] = [
  {
		"model_id" : 1,
		"model_cd" : "001",
		"model_nm" : "AUDI",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f5f324c2-1e69-47b4-bcb6-4477d4238daf"
	},
	{
		"model_id" : 2,
		"model_cd" : "002",
		"model_nm" : "TAM",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c303fb4c-28d9-4bd3-a2db-e60bf68dff28"
	},
	{
		"model_id" : 3,
		"model_cd" : "003",
		"model_nm" : "TF U2 ENG",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "381926eb-4117-4d1b-831c-f27dfe36c89f"
	},
	{
		"model_id" : 4,
		"model_cd" : "004",
		"model_nm" : "RBK",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "352e0607-9a4b-482b-8978-3769258add42"
	},
	{
		"model_id" : 5,
		"model_cd" : "005",
		"model_nm" : "DVE12",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "45fd3093-b65c-49ae-bc8e-a027a4dabdd9"
	},
	{
		"model_id" : 6,
		"model_cd" : "006",
		"model_nm" : "LM MDPS",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a1fbd821-8090-4ce4-a83d-ee0302cf2248"
	},
	{
		"model_id" : 7,
		"model_cd" : "007",
		"model_nm" : "PBT",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "b9c92a7e-6c21-41da-8462-e11a38539345"
	},
	{
		"model_id" : 8,
		"model_cd" : "008",
		"model_nm" : "MX",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ce15f7d6-549f-4d81-94bf-bd489834c1c3"
	},
	{
		"model_id" : 9,
		"model_cd" : "009",
		"model_nm" : "D1XX",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f9019db6-dcc1-4cb4-b580-8d8eb7a74fd5"
	},
	{
		"model_id" : 10,
		"model_cd" : "010",
		"model_nm" : "GMV",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2b9b80a7-0620-48a3-91dc-c5950841afd6"
	},
	{
		"model_id" : 11,
		"model_cd" : "011",
		"model_nm" : "XMA 12MY",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "957908fe-c904-4a19-9712-ead6a343f84b"
	},
	{
		"model_id" : 12,
		"model_cd" : "012",
		"model_nm" : "HA",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "65ccaf60-c944-40c2-abb4-a56a0d7d43f3"
	},
	{
		"model_id" : 13,
		"model_cd" : "013",
		"model_nm" : "VF",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "409a1869-a5e4-42a7-8259-41fe0d8bfbed"
	},
	{
		"model_id" : 14,
		"model_cd" : "014",
		"model_nm" : "J64T",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "fc8e97f4-bd21-4121-809b-f2bd1bbc59a2"
	},
	{
		"model_id" : 15,
		"model_cd" : "015",
		"model_nm" : "SO",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9100f302-5d88-4483-b486-8442b6654af8"
	},
	{
		"model_id" : 16,
		"model_cd" : "016",
		"model_nm" : "W10",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c8d288da-93c4-4a2a-b31a-aec5767c9d80"
	},
	{
		"model_id" : 17,
		"model_cd" : "017",
		"model_nm" : "FS18",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "03c5b674-a0c5-4c75-bbee-06e3417ddfdf"
	},
	{
		"model_id" : 18,
		"model_cd" : "018",
		"model_nm" : "TD",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "28d243a6-fe00-443b-9e45-f970d3ada5dc"
	},
	{
		"model_id" : 19,
		"model_cd" : "019",
		"model_nm" : "RP",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "49eaecc1-9fc6-4f97-aaad-1f164a6af480"
	},
	{
		"model_id" : 20,
		"model_cd" : "020",
		"model_nm" : "SDC50",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f6d63f11-405c-45fc-872f-c9e0182d2600"
	},
	{
		"model_id" : 21,
		"model_cd" : "021",
		"model_nm" : "RB",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cfa9bd46-81d9-4368-a596-693d5b8a6057"
	},
	{
		"model_id" : 22,
		"model_cd" : "022",
		"model_nm" : "TA",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "58555022-c857-4287-8b88-2c960e2bee4d"
	},
	{
		"model_id" : 23,
		"model_cd" : "023",
		"model_nm" : "KH",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "61874379-27ad-41fd-99c8-a8e32f3fe5db"
	},
	{
		"model_id" : 24,
		"model_cd" : "024",
		"model_nm" : "SANDEN",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "afd82b42-77b5-4837-9f10-1d805c36e3d3"
	},
	{
		"model_id" : 25,
		"model_cd" : "025",
		"model_nm" : "BMW",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d6a9651f-c272-4f65-97ca-0a494849ce77"
	},
	{
		"model_id" : 26,
		"model_cd" : "026",
		"model_nm" : "X10",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "30103e6d-8f27-4e86-89bd-87c6e59b68c9"
	},
	{
		"model_id" : 27,
		"model_cd" : "027",
		"model_nm" : "DH",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "aab29747-83b8-4606-aeb7-5e264dd23cbc"
	},
	{
		"model_id" : 28,
		"model_cd" : "028",
		"model_nm" : "SA",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bbae0acf-b15b-41ed-ac11-d424eb044190"
	},
	{
		"model_id" : 29,
		"model_cd" : "029",
		"model_nm" : "D2XX",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "103fc520-233a-470d-99c6-7faa9a3593d8"
	},
	{
		"model_id" : 30,
		"model_cd" : "030",
		"model_nm" : "LH-T-CAR",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "74912af6-3b72-4d04-86c9-c2b72c06b871"
	},
	{
		"model_id" : 31,
		"model_cd" : "031",
		"model_nm" : "F\/M",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "88eb3d53-20f4-4359-a88d-7da639d48302"
	},
	{
		"model_id" : 32,
		"model_cd" : "032",
		"model_nm" : "M2XX",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "efb5667e-9540-4767-a0c3-e8608574ab47"
	},
	{
		"model_id" : 33,
		"model_cd" : "033",
		"model_nm" : "DH",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "56f2765f-fa31-4daf-a83c-cef2a8f14523"
	},
	{
		"model_id" : 34,
		"model_cd" : "034",
		"model_nm" : "X98",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "24854c82-7a57-402b-a90f-6994b392ef7b"
	},
	{
		"model_id" : 35,
		"model_cd" : "035",
		"model_nm" : "LF",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cb62cd85-6653-4006-8c51-a240a60d139e"
	},
	{
		"model_id" : 36,
		"model_cd" : "036",
		"model_nm" : "GEN2",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "925005d8-b3b9-41e7-9edd-cf4d46e515a6"
	},
	{
		"model_id" : 37,
		"model_cd" : "037",
		"model_nm" : "ZETA",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "367d5a29-b915-4d83-a960-59e84384dfa3"
	},
	{
		"model_id" : 38,
		"model_cd" : "038",
		"model_nm" : "D1SC",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "84dd527f-741a-41e2-ad96-229f0aa2f398"
	},
	{
		"model_id" : 39,
		"model_cd" : "039",
		"model_nm" : "FORD C2",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e0cf3da1-ed4d-4cf4-bcf9-927711fd005c"
	},
	{
		"model_id" : 40,
		"model_cd" : "040",
		"model_nm" : "UM",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "09cb6916-d0a3-4fda-9526-250959731cb9"
	},
	{
		"model_id" : 41,
		"model_cd" : "041",
		"model_nm" : "BMW LU",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "57f3319b-06fb-4daa-9e78-2a8403916ddf"
	},
	{
		"model_id" : 42,
		"model_cd" : "042",
		"model_nm" : "D1XX",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f8b978b1-39dc-4b74-8da5-5a44ec8936c8"
	},
	{
		"model_id" : 43,
		"model_cd" : "043",
		"model_nm" : "TTS향",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4d2fd1b7-dd64-4312-9431-45eb13fc0b11"
	},
	{
		"model_id" : 44,
		"model_cd" : "044",
		"model_nm" : "BH A\/S",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "94f3f986-91d9-405e-a9fe-e53e34642423"
	},
	{
		"model_id" : 45,
		"model_cd" : "045",
		"model_nm" : "M-200",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "48572871-033b-43ca-99f9-8d697cc25ed1"
	},
	{
		"model_id" : 46,
		"model_cd" : "046",
		"model_nm" : "M-300",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "38b47f26-0441-483b-ada6-16b88ac9a876"
	},
	{
		"model_id" : 47,
		"model_cd" : "047",
		"model_nm" : "400형",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "1836d08b-ad69-4703-a4a1-f2fb4e082820"
	},
	{
		"model_id" : 48,
		"model_cd" : "048",
		"model_nm" : "500형",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d9eded8a-0480-4ccc-8e6e-4c2b53c1ce87"
	},
	{
		"model_id" : 49,
		"model_cd" : "049",
		"model_nm" : "600형",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "d9d9815f-924e-45fe-b87e-e4df398f9bd9"
	},
	{
		"model_id" : 50,
		"model_cd" : "050",
		"model_nm" : "HZG",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5738a866-469a-432e-ba1b-43772b3349a7"
	},
	{
		"model_id" : 51,
		"model_cd" : "051",
		"model_nm" : "SDC80",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a352dea8-daf5-45a0-b37c-86afd3be2f7b"
	},
	{
		"model_id" : 52,
		"model_cd" : "052",
		"model_nm" : "HV14",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "0406f44d-37c0-4f2e-b2d0-fa814b5f5373"
	},
	{
		"model_id" : 53,
		"model_cd" : "053",
		"model_nm" : "CK",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "06c45215-73d0-4aec-bc70-856d7ed7ae8e"
	},
	{
		"model_id" : 54,
		"model_cd" : "054",
		"model_nm" : "D7UF1",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "020f2b94-bd20-43df-a2f4-ab30bbd81e5e"
	},
	{
		"model_id" : 55,
		"model_cd" : "055",
		"model_nm" : "others",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "39305589-a920-4cb6-bcb4-814bca2f053b"
	},
	{
		"model_id" : 56,
		"model_cd" : "056",
		"model_nm" : "U375",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "00f1500b-be06-40fa-974f-5635ed03cff9"
	},
	{
		"model_id" : 57,
		"model_cd" : "057",
		"model_nm" : "200형",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4cc4ce22-8bb2-4889-a944-c506ecb15e6c"
	},
	{
		"model_id" : 58,
		"model_cd" : "058",
		"model_nm" : "300형",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "ea92fc9a-b741-4a8f-9be4-95681383ad48"
	},
	{
		"model_id" : 59,
		"model_cd" : "059",
		"model_nm" : "100형",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "2ae5e290-edcf-441b-b957-0df29875aab7"
	},
	{
		"model_id" : 60,
		"model_cd" : "060",
		"model_nm" : "AH2 입실론",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "bc957a47-8bdf-4094-902a-b267c96ab037"
	},
	{
		"model_id" : 61,
		"model_cd" : "061",
		"model_nm" : "BLA",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9eb0c3b9-9860-4376-b1f5-5fff06645d51"
	},
	{
		"model_id" : 62,
		"model_cd" : "062",
		"model_nm" : "DN8 THETA",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "a821ccf6-493e-4333-a788-4537fb73fbba"
	},
	{
		"model_id" : 63,
		"model_cd" : "063",
		"model_nm" : "DN8 감마",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e0617cb1-cfc6-4c3c-8f01-d3e437dd5ea7"
	},
	{
		"model_id" : 64,
		"model_cd" : "064",
		"model_nm" : "QA4\/Scolpio",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "9d3767c9-1a35-4127-bd3f-78609327558b"
	},
	{
		"model_id" : 65,
		"model_cd" : "065",
		"model_nm" : "Mazda Gen7",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "4625c178-1b34-4670-b55f-cc26cf5a69b5"
	},
	{
		"model_id" : 66,
		"model_cd" : "066",
		"model_nm" : "BC3",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "8c698770-d9b3-4a8e-8150-94de6811d107"
	},
	{
		"model_id" : 67,
		"model_cd" : "067",
		"model_nm" : "SU2I",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c5c1579f-a3f2-4df0-97b4-bfc5dcba6939"
	},
	{
		"model_id" : 68,
		"model_cd" : "068",
		"model_nm" : "YP",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e2dba612-087e-4971-9b9e-e3a2270f7016"
	},
	{
		"model_id" : 69,
		"model_cd" : "069",
		"model_nm" : "HI",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "5881b11a-99bd-41b9-89db-0de8ccc85200"
	},
	{
		"model_id" : 70,
		"model_cd" : "070",
		"model_nm" : "LF",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "999cc839-f27f-4c89-a08e-64a5dd01cb2e"
	},
	{
		"model_id" : 71,
		"model_cd" : "071",
		"model_nm" : "VI",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "cbef19a8-2e3c-4cd5-a082-d6e947f2c09c"
	},
	{
		"model_id" : 72,
		"model_cd" : "072",
		"model_nm" : "W2",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "c0904c3d-bae1-48ca-9e9d-c5936b2bb3d5"
	},
	{
		"model_id" : 73,
		"model_cd" : "073",
		"model_nm" : "JX1",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "89b894dd-f7cf-40b7-9eb1-cbd5058c70f5"
	},
	{
		"model_id" : 74,
		"model_cd" : "074",
		"model_nm" : "NE,JW",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "e31da435-a46f-4554-a72d-a82b6d82f3d1"
	},
	{
		"model_id" : 75,
		"model_cd" : "075",
		"model_nm" : "QZ",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "581bd42a-9fa5-4985-974d-de90280a7eaf"
	},
	{
		"model_id" : 76,
		"model_cd" : "076",
		"model_nm" : "HKMC SK",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "f3fc6ea0-da2c-4325-b100-7a0e77652932"
	},
	{
		"model_id" : 77,
		"model_cd" : "077",
		"model_nm" : "AC3",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "50e05c82-ebdc-4140-8e10-80f92f9afd78"
	},
	{
		"model_id" : 78,
		"model_cd" : "078",
		"model_nm" : "FORD TVM",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "7be1d76c-93d4-46ff-9b9e-0fe28b6f9c30"
	},
	{
		"model_id" : 79,
		"model_cd" : "079",
		"model_nm" : "Self-Levelizer",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "03dea8ca-def8-4ad8-9db1-f03cec4919c8"
	},
	{
		"model_id" : 80,
		"model_cd" : "080",
		"model_nm" : "LIMITER ASS'Y",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "3348086a-9ead-4297-816d-a9037c31c3b4"
	},
	{
		"model_id" : 81,
		"model_cd" : "081",
		"model_nm" : "HUB",
		"created_uid" : 1,
		"updated_uid" : 1,
		"uuid" : "400213ea-8e31-4d7a-81b1-b504ac4d0abc"
	}
]

const baseMigration = new BaseMigration('StdModel', 'model_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };