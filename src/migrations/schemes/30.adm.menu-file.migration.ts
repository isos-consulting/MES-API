import IAdmMenuFile from "../../interfaces/adm/menu-file.interface";
import BaseMigration from "../base-migration";

// Seed Datas
const seedDatas: IAdmMenuFile[] = [];

const baseMigration = new BaseMigration('AdmMenuFile', 'bookmark_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };