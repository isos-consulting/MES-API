import IStdBarcodeHistory from "../../interfaces/std/barcode-history.interface";
import BaseMigration from "../base-migration";

// Seed Datas
const seedDatas: IStdBarcodeHistory[] = [

];

const baseMigration = new BaseMigration('StdBarcodeHistory', 'barcode_history_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };