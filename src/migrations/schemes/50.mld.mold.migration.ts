import IMldMold from '../../interfaces/mld/mold.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IMldMold[] = [
]

const baseMigration = new BaseMigration('MldMold', 'mold_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };