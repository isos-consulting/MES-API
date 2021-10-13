import convertFromProcedure from './convertFromProcedure';
import convertToNvarchar from './convertToNvarchar';
import sequelize from '../models'

// ========== InputData Example ==========
// const columns = ['column1', 'column2'];
// const values = [
//   {
//     column1: 1,
//     column2: 'abc'
//   },
//   {
//     column1: 2,
//     column2: 'def'
//   }
// ]

// 다중 PK 중복여부 검사 함수
const checkMultipleDuplication = async (table: string, columns: string[], values: any[]) => {
  try {
    let resultLength: number = 0;
    let resultStr: string = '';

    for await (let value of values) {
      try {
        let andQuery: string = '';
        columns.forEach((column) => {
          andQuery += ` AND ${column} = ${convertToNvarchar(value[column])}`
        });
        
        const query: string = 
          ` SELECT ${columns.join(',')} FROM ${table}
            WHERE deleted_at IS NULL ` + andQuery;

        const result = convertFromProcedure(await sequelize.query(query));
        resultLength += result.length;

        if (result.length !== 0) {
          const duplicationValues = columns.map((column) => {
            return value[column];
          });

          resultStr += `{ ${duplicationValues.join(',')} }`;
        }
      } catch (error) {
        throw error;
      }
    }

    if (resultLength === 0) {
      return false;
    }

    resultStr = `${columns.join(',')} 중복 : ` + resultStr;
    return resultStr;
  } catch (error) {
    throw error;
  }
};

export default checkMultipleDuplication;