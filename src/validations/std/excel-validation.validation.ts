import { body } from 'express-validator';
import { errorState } from '../../states/common.state';
import excelValidationInfos from '../../types/excel-validation-info.type';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdExcelValidation';

const stdExcelValidationValidation = {
	excelValidation: [
    body('header.excel_form_cd', '엑셀 폼 코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'excel_form_cd', '엑셀 폼 코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_cd', '엑셀 폼 코드'))
      .isIn(Object.keys(excelValidationInfos)).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_cd', '엑셀 폼 코드')),
    body('details', '엑셀 데이터')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'details', '엑셀 데이터'))
	],
};

export default stdExcelValidationValidation;