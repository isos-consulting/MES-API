import IAutBookmark from "../../interfaces/aut/bookmark.interface";
import BaseMigration from "../base-migration";

// Seed Datas
const seedDatas: IAutBookmark[] = [];

const baseMigration = new BaseMigration('AutBookmark', 'bookmark_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };