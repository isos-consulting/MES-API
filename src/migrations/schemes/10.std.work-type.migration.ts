import BaseMigration from '../base-migration';
import config from '../../configs/config';
import IStdWorkType from '../../interfaces/std/work-type.interface';

// Seed Datas
let seedDatas: IStdWorkType[] = []

const baseMigration = new BaseMigration('StdWorkType', 'work_type_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };