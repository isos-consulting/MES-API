import IPrdWorkReject from '../../interfaces/prd/work-reject.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IPrdWorkReject[] = [
];

const baseMigration = new BaseMigration('PrdWorkReject', 'work_reject_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };