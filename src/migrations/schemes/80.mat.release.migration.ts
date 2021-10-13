import IMatRelease from '../../interfaces/mat/release.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IMatRelease[] = [
]

const baseMigration = new BaseMigration('MatRelease', 'release_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };