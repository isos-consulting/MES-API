import { body, param } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'admInspHandlingType';

const admInspHandlingTypeValidation = {
  read: [],
  readByUuid: [ 
    param('uuid', '검사처리유형UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '검사처리유형UUID'))
  ],
  create: [
    body('*.insp_handling_type_cd', '검사처리유형코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_handling_type_cd', '검사처리유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_handling_type_cd', '검사처리유형코드')),
    body('*.insp_handling_type_nm', '검사처리유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_handling_type_nm', '검사처리유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_handling_type_nm', '검사처리유형명')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬')),
  ],
  update: [
    body('*.uuid', '검사처리유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사처리유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사처리유형UUID')),
    body('*.insp_handling_type_cd', '검사처리유형코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_handling_type_cd', '검사처리유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_handling_type_cd', '검사처리유형코드')),
    body('*.insp_handling_type_nm', '검사처리유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_handling_type_nm', '검사처리유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_handling_type_nm', '검사처리유형명')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬')),
  ],
  patch: [
    body('*.uuid', '검사처리유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사처리유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사처리유형UUID')),
    body('*.insp_handling_type_cd', '검사처리유형코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_handling_type_cd', '검사처리유형코드')),
    body('*.insp_handling_type_nm', '검사처리유형명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_handling_type_nm', '검사처리유형명')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬')),
  ],
  delete: [
    body('*.uuid', '검사처리유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사처리유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사처리유형UUID'))
  ],
};

export default admInspHandlingTypeValidation;