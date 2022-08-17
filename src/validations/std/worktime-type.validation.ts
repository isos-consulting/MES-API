import { body, param } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdPartnerType';

const stdWorktimeTypeValidation = {
	read: [

	],
  readByUuid: [ 
    param('uuid', '근무유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '근무유형UUID'))
  ],
  create: [
    body('*.worktime_type_cd', '근무유형코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'worktime_type_cd', '근무유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_type_cd', '근무유형코드')),
    body('*.worktime_type_nm', '근무유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'worktime_type_nm', '근무유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_type_nm', '근무유형명')),
	],
  update: [
    body('*.uuid', '근무유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '근무유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '근무유형UUID')),
		body('*.worktime_type_cd', '근무유형코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'worktime_type_cd', '근무유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_type_cd', '근무유형코드')),
    body('*.worktime_type_nm', '근무유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'worktime_type_nm', '근무유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_type_nm', '근무유형명')),
  ],
  patch: [
    body('*.uuid', '근무유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '근무유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '근무유형UUID')),
		body('*.worktime_type_cd', '근무유형코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_type_cd', '근무유형코드')),  
    body('*.worktime_type_nm', '근무유형명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_type_nm', '근무유형명')),
  ],
  delete: [
    body('*.uuid', '근무유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '근무유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '근무유형UUID'))
  ],
};

export default stdWorktimeTypeValidation;