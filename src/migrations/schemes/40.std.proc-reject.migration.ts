import IStdProcReject from '../../interfaces/std/proc-reject.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdProcReject[] = [
	
]

const baseMigration = new BaseMigration('StdProcReject', 'proc_reject_id', process.env.DB_RESET_TYPE === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };