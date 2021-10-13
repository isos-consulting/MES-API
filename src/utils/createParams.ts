import convertToNvarchar from './convertToNvarchar'

// ========== InputData Example ==========
// createParams('@column1', 'abc')

// DB Param String 생성 함수
const createParams = (dbParamName: string, value: string | number | undefined) => {
  switch (typeof value) {
    case 'string':
      return `${dbParamName}=${convertToNvarchar(value)}`;
    case 'number':
      return `${dbParamName}=${isNaN(value) ? null : value}`;
    case 'undefined':
      return `${dbParamName}=${null}`;
  }
};

export default createParams;