import sequelize from "../models";

/**
 * Table 의 Sequence 재정렬 함수
 * Table Insert 전 Sequence 를 재정렬 하여 Sequence Error 방지
 * @param _tableName 재정렬 할 Table Name
 * @param _columnName Table 의 Sequence Column Name
 */
const rearrangeSequence = async (_tableName: string, _columnName: string) => {
  await sequelize.query(`SELECT setval(pg_get_serial_sequence('${_tableName}', '${_columnName}'), (SELECT COALESCE(max(${_columnName}),0)+1 FROM ${_tableName}), false);`);
}

export default rearrangeSequence;