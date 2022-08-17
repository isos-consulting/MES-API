import BaseMigration from '../base-migration';
import config from '../../configs/config';
import IStdWorktime from '../../interfaces/std/worktime.interface';

// Seed Datas
let seedDatas: IStdWorktime[] = []

const baseMigration = new BaseMigration('StdWorktime', 'worktime_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };