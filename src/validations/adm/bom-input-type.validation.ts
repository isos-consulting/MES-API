import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'admBomInputType';

const admBomInputTypeValidation = {
  read: [
    query('bom_input_type_cd', 'BOM 투입유형코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'bom_input_type_cd', 'BOM 투입유형코드'))
  ],
  readByUuid: [ 
    param('uuid', 'BOM 투입유형UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', 'BOM 투입유형UUID'))
  ],
  create: [
    body('*.bom_input_type_cd', 'BOM 투입유형코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'bom_input_type_cd', 'BOM 투입유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_input_type_cd', 'BOM 투입유형코드')),
    body('*.bom_input_type_nm', 'BOM 투입유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'bom_input_type_nm', 'BOM 투입유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_input_type_nm', 'BOM 투입유형명')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
  ],
  update: [
    body('*.uuid', 'BOM 투입유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', 'BOM 투입유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', 'BOM 투입유형UUID')),
    body('*.bom_input_type_cd', 'BOM 투입유형코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'bom_input_type_cd', 'BOM 투입유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_input_type_cd', 'BOM 투입유형코드')),
    body('*.bom_input_type_nm', 'BOM 투입유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'bom_input_type_nm', 'BOM 투입유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_input_type_nm', 'BOM 투입유형명')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
  ],
  patch: [
    body('*.uuid', 'BOM 투입유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', 'BOM 투입유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', 'BOM 투입유형UUID')),
    body('*.bom_input_type_cd', 'BOM 투입유형코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_input_type_cd', 'BOM 투입유형코드')),
    body('*.bom_input_type_nm', 'BOM 투입유형명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_input_type_nm', 'BOM 투입유형명')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
  ],
  delete: [
    body('*.uuid', 'BOM 투입유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', 'BOM 투입유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', 'BOM 투입유형UUID'))
  ],
};

export default admBomInputTypeValidation;