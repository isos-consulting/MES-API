import { Sequelize } from "sequelize-typescript";
import { getSequelize } from "./getSequelize";

/**
 * Materialized View Drop
 * @param _viewNm 제거 할 View의 Name
 */
const dropMaterializedView = async (tenant: string, _viewNm: string) => {
  const sequelize = getSequelize(tenant) as Sequelize;
  await sequelize.query(`DROP MATERIALIZED VIEW IF EXISTS ${_viewNm};`);
}

export default dropMaterializedView;