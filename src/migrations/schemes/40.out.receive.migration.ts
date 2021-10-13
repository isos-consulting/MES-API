import IOutReceive from '../../interfaces/out/receive.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IOutReceive[] = [
];

const baseMigration = new BaseMigration('OutReceive', 'receive_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };