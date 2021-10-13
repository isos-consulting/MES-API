import ApiResult from "../interfaces/common/api-result.interface";

// raw = [
//   ModelName(object) {
//     dataValues,
//     _previousDataValues,
//     _changed,
//     _options,
//     isNewRecord
//   }
// ]
// 의 형태를 가진 raw 의 배열을 { value 의 총 개수, dataValues 의 배열로 변환 }


/**
 * sequelize ORM 의 bulkInsert 등의 명령어로 처리되어 Return 된 Values 를 
 * { count: 영향받은 row 의 개수, raws: 영향 받은 row 의 Data Array } 형태로 변환
 * @param _raws 명령어 처리로 Return 된 Value 의 Array
 * @returns object ApiResult<any>
 */
const convertBulkResult = (_raws: any[]): ApiResult<any> => {
  const raws = _raws.map((raw) => {
    return raw.dataValues;
  });
  return { count : raws.length, raws }
}

export default convertBulkResult;