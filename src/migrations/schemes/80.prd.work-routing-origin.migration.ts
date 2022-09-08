import IPrdWorkRoutingOrigin from '../../interfaces/prd/work-routing-origin.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
const seedDatas: IPrdWorkRoutingOrigin[] = [

];

const baseMigration = new BaseMigration('PrdWorkRoutingOrigin', 'work_routing_origin_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };