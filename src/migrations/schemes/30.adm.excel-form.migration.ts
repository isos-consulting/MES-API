import IAdmExcelForm from '../../interfaces/adm/excel-form.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAdmExcelForm[] = [
]

const baseMigration = new BaseMigration('AdmExcelForm', 'excel_form_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };