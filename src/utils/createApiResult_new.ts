import express from 'express';
import ApiResult from '../interfaces/common/api-result.interface';
import response from './response_new';

const createApiResult = (
  res: express.Response,
  result: ApiResult<any>,
  status: number,
  message: string,
  stateTag: string,
  stateNo: string
) => {
  return response(
    res, 
    { value: { count: result.count }, raws: result.raws, status, message: { admin_message: message, user_message: message } },
    { state_tag: stateTag, type: 'SUCCESS', state_no: stateNo }
  );
};

export default createApiResult;