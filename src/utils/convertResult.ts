// raw = [
//   count,
//   [
//     ModelName(object) {
//       dataValues,
//       _previousDataValues,
//       _changed,
//       _options,
//       isNewRecord
//     }
//   ]
// ]
// 의 형태를 가진 raw 의 배열을 { count 의 총합, dataValues 의 배열로 변환 }

import ApiResult from "../interfaces/common/api-result.interface";
import convertToDataValues from "./convertToDataValues";

/**
 * sequelize ORM 의 insert, update, delete 명령어로 처리되어 Return 된 Values 를 
 * { count: 영향받은 row 의 개수, raws: 영향 받은 row 의 Data Array } 형태로 변환
 * @param _raws 명령어 처리로 Return 된 Value 의 Array
 * @returns object ApiResult<any>
 */
const convertResult = (_raws: any[]): ApiResult<any> => {
  let count: number = 0;
  let dataValue: any;
  let raws: any[] = [];

  for (const raw of _raws) {
    count++;

    dataValue = convertToDataValues(raw);
    if (!dataValue) { continue; }

    raws.push(dataValue);
  }
  
  return { count, raws };
};

export default convertResult;