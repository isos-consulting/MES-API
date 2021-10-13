import IOutReceiveDetail from '../../interfaces/out/receive-detail.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IOutReceiveDetail[] = [
];

const baseMigration = new BaseMigration('OutReceiveDetail', 'receive_detail_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };