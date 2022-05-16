import { param, query, body } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'salOrderDetail';

const salOrderDetailValidation = {
  read: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('partner_uuid', '거래처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_uuid', '거래처UUID')),
		query('complete_state', '판매완료여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'complete_state', '판매완료여부'))
      .isIn([ 'all', 'complete', 'incomplete' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'complete_state', '판매완료여부')),
		query('start_reg_date', '기준 시작일자').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_reg_date', '기준 시작일자')),
    query('end_reg_date', '기준 종료일자').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_reg_date', '기준 종료일자')),
    query('start_due_date', '납기 시작일자').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_due_date', '납기 시작일자')),
    query('end_date', '납기 종료일자').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '납기 종료일자'))
  ],
  readByUuid: [
    param('uuid', '제품수주상세UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '제품수주상세UUID'))
  ],
	updateComplete: [
		body('*.uuid', '제품수주상세UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '제품수주상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '제품수주상세UUID')),
		body('*.complete_fg', '수주완료 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'complete_fg', '수주완료 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'complete_fg', '수주완료 유무'))
	]
};

export default salOrderDetailValidation;