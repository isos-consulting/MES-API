import IStdShift from '../../interfaces/std/shift.interface';
import BaseMigration from '../base-migration';

let seedDatas: IStdShift[] = [
 
]

const baseMigration = new BaseMigration('StdShift', 'shift_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };