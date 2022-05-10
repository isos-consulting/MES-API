import { errorState } from "../states/common.state";

const createValidationError = (value: any, stateTag: string, stateNo: string, status: number, param: string, alias: string, message?: string) => {
  
  let adminValidateMessage: string = '';
  let userValidateMessage: string = '';
  if (!message) {
    switch (stateNo) {
      case errorState.NO_INPUT_REQUIRED_PARAM: 
        adminValidateMessage = `${alias}(${param}) 항목을 입력하지 않았습니다.`; 
        userValidateMessage = `필수 항목을 입력하지 않았습니다.`; 
        break;
      case errorState.INVALID_READ_PARAM: 
        adminValidateMessage = `${alias}(${param})에 잘못된 값이 입력되었습니다. [${value}]`; 
        userValidateMessage = `잘못된 형식의 값이 입력되었습니다.`; 
        break;
      case errorState.NO_INPUT_REQUIRED_VALUE: 
        adminValidateMessage = `${alias}(${param}) 항목을 입력하지 않았습니다.`; 
        userValidateMessage = `필수 항목을 입력하지 않았습니다.`; 
        break;
      case errorState.INVALID_DATA_TYPE: 
        adminValidateMessage = `${alias}(${param})에 잘못된 값이 입력되었습니다. [${value}]`; 
        userValidateMessage = `잘못된 형식의 값이 입력되었습니다.`; 
        break;
    }
  }

  return {
    state_tag: stateTag,
    state_no: stateNo,
    status,
    message: { admin_message: adminValidateMessage, user_message: userValidateMessage }
  };
}

export default createValidationError;