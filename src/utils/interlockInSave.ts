import isNumber from './isNumber';
import isUuid from './isUuid';
import isBoolean from './isBoolean';
import { TServiceResult } from './response_new';
import { errorState } from '../states/common.state';

type TSaveInterlockModel = {
  column: string,
  alias: string,
  type?: 'INT' | 'NUMERIC' | 'BOOLEAN' | 'DATE' | 'DATETIME' | 'UUID',
  required?: boolean,
  optional_interlock?: () => string | boolean
}

const interlockInSave = async (
  body: any[],
  moduleName: string,
  interlockModels: TSaveInterlockModel[],
  optionalFunction?: (data: any) => Promise<void>
) => {
  const result: TServiceResult = {};

  for await (const data of body) {
    for (const model of interlockModels) {
      // 📌 Required Value Validation
      if (model.required && data[model.column] == null) {
        result.result_info = { status: 500, message: `${model.alias}(${model.column}) 항목을 입력하지 않았습니다.` };
        result.log_info = { state_tag: moduleName, type: 'ERROR', state_no: errorState.NO_INPUT_REQUIRED_VALUE };
        return result;
      }

      // 📌 Type Validation
      let isTypeError = false;
      if (data[model.column] == null) { continue; }

      if (model.type === 'INT' && !isNumber(data[model.column], 'onlyNumber')) { isTypeError = true; }
      if (model.type === 'NUMERIC' && !isNumber(data[model.column], 'all')) { isTypeError = true; }
      if (model.type === 'BOOLEAN' && !isBoolean(data[model.column])) { isTypeError = true; }
      if (model.type === 'UUID' && !isUuid(data[model.column])) { isTypeError = true; }
      if (isTypeError) { 
        result.result_info = { status: 500, message: `${model.alias}(${model.column}) 항목의 형식이 잘못되었습니다. [${data[model.column]}]` };
        result.log_info = { state_tag: moduleName, type: 'ERROR', state_no: errorState.INVALID_DATA_TYPE };
        return result;
      }
    }

    if (optionalFunction) { await optionalFunction(data) };
  }

  return false;
};

export default interlockInSave;