'use strict'

const isNumeric = (data: object) => {
  return !isNaN(Number(data));
}

const convertFromProcedure = (data: any) => {
  if (!Array.isArray(data)) {
    data = [ data ];
  } else {
    // Stored Procedure를 통하여 Return 되는 객체는 [[{data}], number] 형식으로 생성
    if (data.length > 1) {
      if (isNumeric(data[1]) || data[1] === undefined) {
        data = data[0];
      }
    }
  }
  return data;
}

export default convertFromProcedure;