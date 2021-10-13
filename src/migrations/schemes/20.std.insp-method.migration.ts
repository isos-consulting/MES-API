import IStdInspMethod from '../../interfaces/std/insp-method.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdInspMethod[] = [
]

const baseMigration = new BaseMigration('StdInspMethod', 'insp_method_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };