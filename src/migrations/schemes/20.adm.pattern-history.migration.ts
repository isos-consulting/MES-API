import IAdmPatternHistory from '../../interfaces/adm/pattern-history.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IAdmPatternHistory[] = [
];

const baseMigration = new BaseMigration('AdmPatternHistory', 'pattern_history_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };