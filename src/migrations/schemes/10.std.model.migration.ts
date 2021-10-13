import IStdModel from '../../interfaces/std/model.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdModel[] = [
]

const baseMigration = new BaseMigration('StdModel', 'model_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };