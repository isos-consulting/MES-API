import sequelize from "../models";

/**
 * Materialized View Drop
 * @param _viewNm 제거 할 View의 Name
 */
const dropMaterializedView = async (_viewNm: string) => {
  await sequelize.query(`DROP MATERIALIZED VIEW IF EXISTS ${_viewNm};`);
}

export default dropMaterializedView;