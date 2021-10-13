import IStdDowntime from '../../interfaces/std/downtime.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdDowntime[] = [

]

const baseMigration = new BaseMigration('StdDowntime', 'downtime_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };