import IStdBarcode from "../../interfaces/std/barcode.interface";
import BaseMigration from "../base-migration";

// Seed Datas
const seedDatas: IStdBarcode[] = [
	
];

const baseMigration = new BaseMigration('StdBarcode', 'barcode_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };