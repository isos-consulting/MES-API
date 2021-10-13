import IStdInspItem from '../../interfaces/std/insp-item.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdInspItem[] = [
]

const baseMigration = new BaseMigration('StdInspItem', 'insp_item_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };