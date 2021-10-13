import IStdDowntimeType from '../../interfaces/std/downtime-type.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdDowntimeType[] = [
]

const baseMigration = new BaseMigration('StdDowntimeType', 'downtime_type_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };