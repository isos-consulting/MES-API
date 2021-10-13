import IOutRelease from '../../interfaces/out/release.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IOutRelease[] = [
];

const baseMigration = new BaseMigration('OutRelease', 'release_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };