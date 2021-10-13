import * as httpStatus from 'http-status';
import * as express from 'express';
// import * as createError from 'http-errors';

// import convertFromProcedure from './convertFromProcedure'
import checkArray from './checkArray';

// const isNumeric = (data: any) => {
//   return !isNaN(Number(data));
// }

const response = (res: express.Response, raws: any = [], value = {}, message = '', code = httpStatus.OK) => {
  let success = true;

  raws = checkArray(raws);
  // raws = convertFromProcedure(raws);

  // Sequelize Model에서 사용
  // if (!Array.isArray(raws)) {
  //   raws = [ raws ];
  // } else {
  //   // API 통신 결과를 개수와 값의 형태로 출력하는 경우 값만 출력하도록 변경
  //   if (raws.length > 1) { 
  //     if (isNumeric(raws[0]) || raws[0] === undefined) {
  //       raws = [ raws[1] ];
  //     }
  //   }
  // }

  const datas = { value, raws }

  if (code > 399) { success = false; }
  let result = { success, message }

  if (typeof datas === 'object') {
    result = Object.assign(
      result, 
      { datas }
    )
  }
  return res.status(code).json(result);
};

export default response;