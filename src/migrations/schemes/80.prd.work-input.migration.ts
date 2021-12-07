import IPrdWorkInput from '../../interfaces/prd/work-input.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IPrdWorkInput[] = [
];

const baseMigration = new BaseMigration('PrdWorkInput', 'work_input_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };