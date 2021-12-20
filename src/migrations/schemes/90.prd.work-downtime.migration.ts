import IPrdWorkDowntime from '../../interfaces/prd/work-downtime.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IPrdWorkDowntime[] = [
];

const baseMigration = new BaseMigration('PrdWorkDowntime', 'work_downtime_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };