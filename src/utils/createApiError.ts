import { TServiceResult } from './response_new';

const createApiError = (
  status: number,
  message: { admin_message: string, user_message?: string },
  stateTag: string,
  stateNo: string
) => {
  return { 
    result_info: { status, message },
    log_info: { state_tag: stateTag, type: 'ERROR', state_no: stateNo }
  } as TServiceResult;
};

export default createApiError;