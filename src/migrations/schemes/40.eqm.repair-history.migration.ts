import IEqmRepairHistory from '../../interfaces/eqm/repair-history.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IEqmRepairHistory[] = [
]

const baseMigration = new BaseMigration('EqmRepairHistory', 'repair_history_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };