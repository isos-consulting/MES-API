import { Sequelize, Transaction } from "sequelize/types";
import { getSequelize } from "./getSequelize";

/**
 * 📒 Fn[refreshMaterializedView]: Function of Refresh MaterializedView
 * @param _viewNm View Name
 * @param tran Transaction
 */
const refreshMaterializedView = async (tenant: string, _viewNm: string, tran?: Transaction) => {
  const sequelize = getSequelize(tenant) as Sequelize;
	await sequelize.query(`REFRESH MATERIALIZED VIEW ${_viewNm};`, { transaction: tran })
		.then(() => {
      console.log(`✅Success Update View ${_viewNm}`);
    })
    .catch((err) => { 
      console.log(`❗️Error in Update View ${_viewNm} : ${err}`);
    });
};

export default refreshMaterializedView;