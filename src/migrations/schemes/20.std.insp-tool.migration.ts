import IStdInspTool from '../../interfaces/std/insp-tool.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdInspTool[] = [
]

const baseMigration = new BaseMigration('StdInspTool', 'insp_tool_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };