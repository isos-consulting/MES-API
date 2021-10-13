import ISalRelease from '../../interfaces/sal/release.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: ISalRelease[] = [
];

const baseMigration = new BaseMigration('SalRelease', 'release_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };