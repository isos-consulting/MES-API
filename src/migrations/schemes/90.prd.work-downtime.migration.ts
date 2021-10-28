import IPrdWorkDowntime from '../../interfaces/prd/work-downtime.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdWorkDowntime[] = [
];

const baseMigration = new BaseMigration('PrdWorkDowntime', 'work_downtime_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };