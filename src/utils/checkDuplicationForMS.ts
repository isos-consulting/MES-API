import convertFromProcedure from './convertFromProcedure';
import sequelize from '../models'

// ========== InputData Example ==========
// await checkDuplication('TableName', 'ColumnName', RequestBody);

// Column 값 중복여부 검사 함수
const checkDuplication = async (table: string, column: string, body: object[]) => {
  const values: string[] = body.map((value: any) => {
    return value[column] as string;
  });

  try {
    const query = 
      ` SELECT ${column} FROM ${table}
        WHERE deleted_at IS NULL
        AND ${column} IN ('${values.join("','")}')`;

    const result = convertFromProcedure(await sequelize.query(query));

    if (result.length === 0) {
      return false;
    }

    let resultStr: string = `${column} 중복 : `;
    let index = 0;

    result.forEach((value: any) => {
      if (index !== 0) {
        resultStr += ', ';  
      }

      resultStr += value[column];
      index++;
    });

    throw new Error(resultStr);
  } catch (error) {
    throw error;
  }
};

export default checkDuplication;