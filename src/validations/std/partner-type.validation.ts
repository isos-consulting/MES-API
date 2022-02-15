import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdPartnerType';

const stdPartnerTypeValidation = {
	upsertBulkDatasFromExcel: [
		query('uuid', '거래처유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '거래처유형UUID')),
		query('partner_type_cd', '거래처유형코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_type_cd', '거래처유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_type_cd', '거래처유형코드')),
		query('partner_type_nm', '거래처유형명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_type_nm', '거래처유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_type_nm', '거래처유형명')),
	],
	read: [

	],
  readByUuid: [ 
    param('uuid', '거래처유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '거래처유형UUID'))
  ],
  create: [
    body('*.partner_type_cd', '거래처유형코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_type_cd', '거래처유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_type_cd', '거래처유형코드')),
    body('*.partner_type_nm', '거래처유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_type_nm', '거래처유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_type_nm', '거래처유형명')),
	],
  update: [
    body('*.uuid', '거래처 유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '거래처 유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '거래처 유형UUID')),
		body('*.partner_type_cd', '거래처유형코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_type_cd', '거래처유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_type_cd', '거래처유형코드')),
    body('*.partner_type_nm', '거래처유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_type_nm', '거래처유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_type_nm', '거래처유형명')),
  ],
  patch: [
    body('*.uuid', '거래처 유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '거래처 유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '거래처 유형UUID')),
		body('*.partner_type_cd', '거래처유형코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_type_cd', '거래처유형코드')),  
    body('*.partner_type_nm', '거래처유형명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_type_nm', '거래처유형명')),
  ],
  delete: [
    body('*.uuid', '거래처 유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '거래처 유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '거래처 유형UUID'))
  ],
};

export default stdPartnerTypeValidation;