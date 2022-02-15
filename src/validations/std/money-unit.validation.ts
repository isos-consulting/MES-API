import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdMoneyUnit';

const stdMoneyUnitValidation = {
	upsertBulkDatasFromExcel: [
		query('uuid', '화폐 단위UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '화폐 단위UUID')),
		query('money_unit_cd', '화폐 단위코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_cd', '화폐 단위코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'money_unit_cd', '화폐 단위코드')),
		query('money_unit_nm', '화폐 단위')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_nm', '화폐 단위'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'money_unit_nm', '화폐 단위')),
	],
	read: [

	],
  readByUuid: [ 
    param('uuid', '화폐 단위UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '화폐 단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '화폐 단위UUID'))
  ],
  create: [
    body('*.money_unit_cd', '화폐 단위코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_cd', '화폐 단위코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_cd', '화폐 단위코드')),
		body('*.money_unit_nm', '화폐 단위')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_nm', '화폐 단위'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_nm', '화폐 단위')),
	],
  update: [
    body('*.uuid', '화폐 단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '화폐 단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '화폐 단위UUID')),
		body('*.money_unit_cd', '화폐 단위코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_cd', '화폐 단위코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_cd', '화폐 단위코드')),
		body('*.money_unit_nm', '화폐 단위')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_nm', '화폐 단위'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_nm', '화폐 단위')),
  ],
  patch: [
    body('*.uuid', '화폐 단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '화폐 단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '화폐 단위UUID')),
		body('*.money_unit_cd', '화폐 단위코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_cd', '화폐 단위코드')),
		body('*.money_unit_nm', '화폐 단위').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_nm', '화폐 단위')),
  ],
  delete: [
    body('*.uuid', '화폐 단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '화폐 단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '화폐 단위UUID'))
  ],
};

export default stdMoneyUnitValidation;