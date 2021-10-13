import ApiResult from "../interfaces/common/api-result.interface";
import checkArray from "./checkArray";

/**
 * sequelize ORM 의 findAll, findOne 명령어로 처리되어 Return 된 Value 를 
 * { count: 조회 된 row 의 개수, raws: 조회 된 row 의 Data Array } 형태로 변환
 * @param _raws 명령어 처리로 Return 된 Value 의 Array
 * @returns object ApiResult<any>
 */
const convertReadResult = (_raws: any): ApiResult<any> => {
  if (!_raws) { _raws = []; }

  const raws = checkArray(_raws);
  const resultArr = raws.map((raw: any) => { return raw.dataValues ? raw.dataValues : raw; });

  return { count: raws.length, raws: resultArr };
};

export default convertReadResult;