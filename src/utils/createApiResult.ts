import ApiResult from '../interfaces/common/api-result.interface';
import { TServiceResult } from './response_new';

const createApiResult = (
  result: ApiResult<any>,
  status: number,
  message: string,
  stateTag: string,
  stateNo: string
) => {
  return { 
    result_info: { value: { count: result.count }, raws: result.raws, status, message },
    log_info: { state_tag: stateTag, type: 'SUCCESS', state_no: stateNo }
  } as TServiceResult;
};

export default createApiResult;