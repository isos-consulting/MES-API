import IStdInspItemType from '../../interfaces/std/insp-item-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdInspItemType[] = [
]

const baseMigration = new BaseMigration('StdInspItemType', 'insp_item_type_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };