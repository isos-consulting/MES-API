import IStdProcEquip from '../../interfaces/std/proc-equip.interface';
import BaseMigration from '../base-migration';

// Seed Datas
let seedDatas: IStdProcEquip[] = [];

const baseMigration = new BaseMigration('StdProcEquip', 'proc_equip_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };