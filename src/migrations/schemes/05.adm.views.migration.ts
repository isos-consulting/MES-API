import sequelize from '../../models';
import convertReadResult from '../../utils/convertReadResult';
import createAdmView from '../../utils/createAdmView';
import dropMaterializedView from '../../utils/dropMaterializedView';

const migration = async () => {
	const read = await sequelize.query('SELECT * FROM adm_std_tb;');
	for await (const data of convertReadResult(read[0]).raws) {
    await createAdmView(data.std_id, data.view_nm, data.col_nm)
    .then(() => {
      console.log(`✅Success Create View ${data.view_nm}`);
    })
    .catch((err) => {
      console.log(`❗️Error in Create View ${data.view_nm} : ${err}`);
    });
	}
};

const migrationUndo = async () => {
	const read = await sequelize.query('SELECT * FROM adm_std_tb;');
	for await (const data of convertReadResult(read[0]).raws) {
    await dropMaterializedView(data.view_nm)
    .then(() => {
      console.log(`✅Success Drop View ${data.view_nm}`);
    })
    .catch((err) => {
      console.log(`❗️Error in Drop View ${data.view_nm} : ${err}`);
    });
	}
};

module.exports = { migration, migrationUndo };