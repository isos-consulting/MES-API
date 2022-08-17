import BaseMigration from '../base-migration';
import config from '../../configs/config';
import IStdWorktimeType from '../../interfaces/std/worktime-type.interface';

// Seed Datas
let seedDatas: IStdWorktimeType[] = []

const baseMigration = new BaseMigration('StdWorktimeType', 'worktime_type_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };