import BaseMigration from '../base-migration';

const baseMigration = new BaseMigration('AdmLog');
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };