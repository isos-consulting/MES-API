import { body, param } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'admCycleUnit';
console.log(`11`)
const admCycleUnitValidation = {
  read: [],
  readByUuid: [ 
    param('uuid', '주기단위UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '주기단위UUID'))
  ],
  create: [
    body('*.cycle_unit_cd', '주기단위코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'cycle_unit_cd', '주기단위코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_unit_cd', '주기단위코드')),
    body('*.cycle_unit_nm', '주기단위명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'cycle_unit_nm', '주기단위명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_unit_nm', '주기단위명')),
		body('*.format', '주기변환포멧')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'format', '주기변환포멧'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'format', '주기변환포멧'))
  ],
  update: [
    body('*.uuid', '주기단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '주기단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '주기단위UUID')),
    body('*.cycle_unit_cd', '주기단위코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'cycle_unit_cd', '주기단위코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_unit_cd', '주기단위코드')),
    body('*.cycle_unit_nm', '주기단위명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'cycle_unit_nm', '주기단위명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_unit_nm', '주기단위명')),
		body('*.format', '주기변환포맷')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'format', '주기변환포맷'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'format', '주기변환포맷'))
  ],
  patch: [
    body('*.uuid', '주기단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '주기단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '주기단위UUID')),
    body('*.cycle_unit_cd', '주기단위코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_unit_cd', '주기단위코드')),
    body('*.cycle_unit_nm', '주기단위명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_unit_nm', '주기단위명')),
		body('*.format', '주기변환포맷').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_unit_nm', '주기변환포맷'))
  ],
  delete: [
    body('*.uuid', '주기단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '주기단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '주기단위UUID'))
  ],
};

export default admCycleUnitValidation;