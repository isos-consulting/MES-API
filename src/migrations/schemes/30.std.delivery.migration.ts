import IStdDelivery from '../../interfaces/std/delivery.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdDelivery[] = [

]

const baseMigration = new BaseMigration('StdDelivery', 'delivery_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };