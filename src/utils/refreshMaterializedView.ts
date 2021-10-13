import { Transaction } from "sequelize/types";
import sequelize from "../models";

/**
 * 📒 Fn[refreshMaterializedView]: Function of Refresh MaterializedView
 * @param _viewNm View Name
 * @param tran Transaction
 */
const refreshMaterializedView = async (_viewNm: string, tran?: Transaction) => {
	await sequelize.query(`REFRESH MATERIALIZED VIEW ${_viewNm};`, { transaction: tran })
		.then(() => {
      console.log(`✅Success Update View ${_viewNm}`);
    })
    .catch((err) => { 
      console.log(`❗️Error in Update View ${_viewNm} : ${err}`);
    });
};

export default refreshMaterializedView;