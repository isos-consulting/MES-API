import IMatReceiveDetail from '../../interfaces/mat/receive-detail.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IMatReceiveDetail[] = [
]

const baseMigration = new BaseMigration('MatReceiveDetail', 'receive_detail_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };