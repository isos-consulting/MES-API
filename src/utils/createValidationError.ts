import { errorState } from "../states/common.state";

const createValidationError = (value: any, stateTag: string, stateNo: string, status: number, param: string, alias: string, message?: string) => {
  if (!message) {
    switch (stateNo) {
      case errorState.NO_INPUT_REQUIRED_PARAM: message = `${alias}(${param}) 항목을 입력하지 않았습니다.`; break;
      case errorState.INVALID_READ_PARAM: message = `${alias}(${param})에 잘못된 값이 입력되었습니다. [${value}]`; break;
      case errorState.NO_INPUT_REQUIRED_VALUE: message = `${alias}(${param}) 항목을 입력하지 않았습니다.`; break;
      case errorState.INVALID_DATA_TYPE: message = `${alias}(${param})에 잘못된 값이 입력되었습니다. [${value}]`; break;
    }
  }

  return {
    state_tag: stateTag,
    state_no: stateNo,
    status,
    message
  };
}

export default createValidationError;