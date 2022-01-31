import IMldProdMold from '../../interfaces/mld/prod-mold.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IMldProdMold[] = [];

const baseMigration = new BaseMigration('MldProdMold', 'prod_mold_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };