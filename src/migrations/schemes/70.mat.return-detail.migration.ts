import IMatReturnDetail from '../../interfaces/mat/return-detail.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IMatReturnDetail[] = [
]

const baseMigration = new BaseMigration('MatReturnDetail', 'return_detail_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };