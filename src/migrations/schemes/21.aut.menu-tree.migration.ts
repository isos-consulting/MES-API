import createMenuTreeView from '../../queries/aut/create-menu-tree-view.query';
import { getSequelize } from '../../utils/getSequelize';

const viewNm = 'AUT_MENU_TREE_VW';

const migration = async () => {
  await getSequelize('test').query(`${createMenuTreeView()}`)
		.then(() => {
      console.log(`✅Success Create View ${viewNm}`);
    })
    .catch((err) => { 
      console.log(`❗️Error in Create View ${viewNm} : ${err}`);
    });
};

const migrationUndo = async () => {
	await getSequelize('test').query(`DROP MATERIALIZED VIEW IF EXISTS ${viewNm};`)
		.then(() => {
      console.log(`✅Success Drop View ${viewNm}`);
    })
    .catch((err) => { 
      console.log(`❗️Error in Drop View ${viewNm} : ${err}`);
    });
};

module.exports = { migration, migrationUndo };