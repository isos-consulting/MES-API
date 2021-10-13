import IStdUnit from '../../interfaces/std/unit.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdUnit[] = [
]

const baseMigration = new BaseMigration('StdUnit', 'unit_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };