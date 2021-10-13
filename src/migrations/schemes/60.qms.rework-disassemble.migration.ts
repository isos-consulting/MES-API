import IQmsReworkDisassemble from '../../interfaces/qms/rework-disassemble.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IQmsReworkDisassemble[] = [
];

const baseMigration = new BaseMigration('QmsReworkDisassemble', 'rework_disassemble_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };