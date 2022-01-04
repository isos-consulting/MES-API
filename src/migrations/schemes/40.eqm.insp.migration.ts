import IEqmInsp from '../../interfaces/eqm/insp.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IEqmInsp[] = [

];

const baseMigration = new BaseMigration('EqmInsp', 'insp_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };