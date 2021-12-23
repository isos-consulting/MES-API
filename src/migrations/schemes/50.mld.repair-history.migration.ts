import IMldRepairHistory from '../../interfaces/mld/repair-history.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IMldRepairHistory[] = [
]

const baseMigration = new BaseMigration('MldRepairHistory', 'repair_history_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };