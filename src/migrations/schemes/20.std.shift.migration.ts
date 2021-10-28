import IStdShift from '../../interfaces/std/shift.interface';
import BaseMigration from '../base-migration';

let seedDatas: IStdShift[] = [
  {
    "shift_id": 1,
    "factory_id": 1,
    "shift_cd": "001",
    "shift_nm": "조식교대",
    "start_time": "08:00:00",
    "end_time": "08:30:00",
    "created_uid": 1,
    "updated_uid": 1,
    "uuid": "fbee50f7-55a6-4004-9246-324d35ff3ea6"
  },
  {
    "shift_id": 2,
    "factory_id": 1,
    "shift_cd": "002",
    "shift_nm": "중식교대",
    "start_time": "12:30:00",
    "end_time": "13:00:00",
    "created_uid": 1,
    "updated_uid": 1,
    "uuid": "79240c11-085b-4c25-9dcd-75eae2096856"
  },
  {
    "shift_id": 3,
    "factory_id": 1,
    "shift_cd": "003",
    "shift_nm": "석식교대",
    "start_time": "18:00:00",
    "end_time": "18:30:00",
    "created_uid": 1,
    "updated_uid": 1,
    "uuid": "f9d9e35f-ad1a-4ec0-bf84-d34064fb05ec"
  }
]

const baseMigration = new BaseMigration('StdShift', 'shift_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };