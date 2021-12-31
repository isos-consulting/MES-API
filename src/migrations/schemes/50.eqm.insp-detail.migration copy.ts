import IEqmInspDetail from '../../interfaces/eqm/insp-detail.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IEqmInspDetail[] = [
	
];

const baseMigration = new BaseMigration('EqmInspDetail', 'insp_detail_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };