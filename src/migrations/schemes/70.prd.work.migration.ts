import IPrdWork from '../../interfaces/prd/work.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IPrdWork[] = [
];

const baseMigration = new BaseMigration('PrdWork', 'work_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };