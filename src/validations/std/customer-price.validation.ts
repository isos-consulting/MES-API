import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdCustomerPrice';

const stdCustomerPriceValidation = {
	upsertBulkDatasFromExcel: [
		query('uuid', '거래처 단가UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '거래처 단가UUID')),
		query('partner_cd', '거래처코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_cd', '거래처코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_cd', '거래처코드')),
		query('prod_no', '품번')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_no', '품번'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prod_no', '품번')),
		query('rev', '리비전')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'rev', '리비전'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'rev', '리비전')),
		query('price', '단가')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'price', '단가'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'price', '단가')),
		query('money_unit_cd', '화폐단위 코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_cd', '화폐단위 코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'money_unit_cd', '화폐단위 코드')),
		query('price_type_cd', '단가 유형코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'price_type_cd', '단가 유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'price_type_cd', '단가 유형코드')),
		query('start_date', '단가 적용일자')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '단가 적용일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'start_date', '단가 적용일자')),
		query('retroactive_price', '소급단가').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'retroactive_price', '소급단가')),
		query('division', '배분율').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'division', '배분율')),
		query('remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'remark', '비고')),
	],
	read: [
    query('prod_uuid', '품목UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prod_uuid', '품목UUID')),
		query('partner_uuid', '거래처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_uuid', '거래처UUID')),
		query('date', '기준일').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'date', '기준일')),
	],
  readByUuid: [ 
    param('uuid', '고객사 단가UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '고객사 단가UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '고객사 단가UUID'))
  ],
  create: [
    body('*.partner_uuid', '거래처UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_uuid', '거래처UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_uuid', '거래처UUID')),
		body('*.prod_uuid', '품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_uuid', '품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
		body('*.price', '단가')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'price', '단가'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'price', '단가')),
		body('*.money_unit_uuid', '화폐단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_uuid', '화폐단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_uuid', '화폐단위UUID')),
		body('*.price_type_uuid', '단가유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'price_type_uuid', '단가유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'price_type_uuid', '단가유형UUID')),
		body('*.start_date', '단가적용일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '단가적용일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '단가적용일자')),
		body('*.retroactive_price', '소급단가').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '소급단가')),
		body('*.division', '배분율').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'division', '배분율')),
		body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
	],
  update: [
    body('*.uuid', '거래처 단가UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '거래처 단가UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '거래처 단가UUID')),
		body('*.price', '단가')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'price', '단가'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'price', '단가')),
		body('*.money_unit_uuid', '화폐단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_uuid', '화폐단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_uuid', '화폐단위UUID')),
		body('*.price_type_uuid', '단가유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'price_type_uuid', '단가유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'price_type_uuid', '단가유형UUID')),
		body('*.start_date', '단가 적용 일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '단가 적용 일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '단가 적용 일자')),
		body('*.retroactive_price', '소급단가').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '소급단가')),
		body('*.division', '배분율').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'division', '배분율')),
		body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  patch: [
    body('*.uuid', '거래처 단가UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '거래처 단가UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '거래처 단가UUID')),
		body('*.price', '단가').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'price', '단가')),
		body('*.money_unit_uuid', '화폐단위UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_uuid', '화폐단위UUID')),
		body('*.price_type_uuid', '단가유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'price_type_uuid', '단가유형UUID')),
		body('*.start_date', '단가 적용 일자').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '단가 적용 일자')),
		body('*.retroactive_price', '소급단가').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '소급단가')),
		body('*.division', '배분율').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'division', '배분율')),
		body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  delete: [
    body('*.uuid', '거래처 단가UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '거래처 단가UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '거래처 단가UUID'))
  ],
};

export default stdCustomerPriceValidation;