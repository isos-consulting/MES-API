import BaseMigration from '../base-migration';
import config from '../../configs/config';
import IStdWorkCalendar from '../../interfaces/std/work-calendar.interface';

// Seed Datas
let seedDatas: IStdWorkCalendar[] = []

const baseMigration = new BaseMigration('StdWorkcalendar', 'workcalendar_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };