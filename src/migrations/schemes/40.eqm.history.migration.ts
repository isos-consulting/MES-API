import IEqmHistory from '../../interfaces/eqm/history.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IEqmHistory[] = [
]

const baseMigration = new BaseMigration('EqmHistory', 'history_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };