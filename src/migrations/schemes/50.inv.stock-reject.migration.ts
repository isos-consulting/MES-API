import IInvStockReject from '../../interfaces/inv/stock-reject.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IInvStockReject[] = [
];

const baseMigration = new BaseMigration('InvStockReject', 'stock_reject_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };