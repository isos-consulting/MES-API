import IEqmInspResult from '../../interfaces/eqm/insp-result.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IEqmInspResult[] = [];

const baseMigration = new BaseMigration('EqmInspResult', 'insp_result_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };