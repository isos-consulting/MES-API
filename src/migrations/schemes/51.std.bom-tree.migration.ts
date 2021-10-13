import sequelize from '../../models';
import createBomTreeView from '../../queries/std/create-bom-tree-view.query';

const viewNm = 'STD_BOM_TREE_VW';

const migration = async () => {
  await sequelize.query(`${createBomTreeView()}`)
		.then(() => {
      console.log(`✅Success Create View ${viewNm}`);
    })
    .catch((err) => { 
      console.log(`❗️Error in Create View ${viewNm} : ${err}`);
    });
};

const migrationUndo = async () => {
	await sequelize.query(`DROP MATERIALIZED VIEW IF EXISTS ${viewNm};`)
		.then(() => {
      console.log(`✅Success Drop View ${viewNm}`);
    })
    .catch((err) => { 
      console.log(`❗️Error in Drop View ${viewNm} : ${err}`);
    });
};

module.exports = { migration, migrationUndo };