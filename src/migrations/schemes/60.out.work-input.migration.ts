import IOutWokrInput from '../../interfaces/out/work-input.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IOutWokrInput[] = [
];

const baseMigration = new BaseMigration('OutWorkInput', 'work_input_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };