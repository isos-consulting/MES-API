import IOutReleaseDetail from '../../interfaces/out/release-detail.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IOutReleaseDetail[] = [
];

const baseMigration = new BaseMigration('OutReleaseDetail', 'release_detail_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };