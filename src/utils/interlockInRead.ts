import isNumber from './isNumber';
import isUuid from './isUuid';
import isBoolean from './isBoolean';
import { TServiceResult } from './response_new';
import { errorState } from '../states/common.state';

type TReadInterlockModel = {
  param: string,
  alias: string,
  type?: 'INT' | 'NUMERIC' | 'BOOLEAN' | 'DATE' | 'DATETIME' | 'UUID',
  required?: boolean,
  optional_interlock?: () => string | boolean
}

const interlockInRead = async (
  params: any,
  moduleName: string,
  interlockModels: TReadInterlockModel[],
  optionalFunction?: (data: any) => Promise<void>
) => {
  const result: TServiceResult = {};

  for (const model of interlockModels) {
    // 📌 Required Value Validation
    if (model.required && params[model.param] == null) {
      result.result_info = { status: 500, message: `${model.alias}(${model.param}) 항목을 입력하지 않았습니다.` };
      result.log_info = { state_tag: moduleName, type: 'ERROR', state_no: errorState.NO_INPUT_REQUIRED_PARAM };
      return result;
    }

    // 📌 Type Validation
    let isTypeError = false;
    if (params[model.param] == null) { continue; }

    if (model.type === 'INT' && !isNumber(params[model.param], 'onlyNumber')) { isTypeError = true; }
    if (model.type === 'NUMERIC' && !isNumber(params[model.param], 'all')) { isTypeError = true; }
    if (model.type === 'BOOLEAN' && !isBoolean(params[model.param])) { isTypeError = true; }
    if (model.type === 'UUID' && !isUuid(params[model.param])) { isTypeError = true; }
    if (isTypeError) { 
      result.result_info = { status: 500, message: `${model.alias}(${model.param})에 잘못된 값이 입력되었습니다. [${params[model.param]}]` };
      result.log_info = { state_tag: moduleName, type: 'ERROR', state_no: errorState.INVALID_READ_PARAM };
      return result;
    }
  }

  if (optionalFunction) { await optionalFunction(params) };

  return false;
};

export default interlockInRead;