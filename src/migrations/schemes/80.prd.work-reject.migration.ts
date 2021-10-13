import IPrdWorkReject from '../../interfaces/prd/work-reject.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdWorkReject[] = [
];

const baseMigration = new BaseMigration('PrdWorkReject', 'work_reject_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };