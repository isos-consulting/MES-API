import IStdEquip from '../../interfaces/std/equip.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdEquip[] = [
]

const baseMigration = new BaseMigration('StdEquip', 'equip_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };