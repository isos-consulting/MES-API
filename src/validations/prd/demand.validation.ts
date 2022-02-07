import { param, query, body } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'prdDemand';

const prdDemandValidation = {
  read: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('order_uuid', '지시UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'order_uuid', '지시UUID')),
    query('to_store_uuid', '입고창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'to_store_uuid', '입고창고UUID')),
    query('complete_state', '완료여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'complete_state', '완료여부'))
      .isIn([ 'all', 'complete', 'incomplete' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'complete_state', '완료여부')),
    query('start_date', '시작일자').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '시작일자')),
    query('end_date', '종료일자').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '종료일자')),
  ],
  readByUuid: [
    param('uuid', '출고요청UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '출고요청UUID'))
  ],
  create: [
    body('*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('*.order_uuid', '지시UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'order_uuid', '지시UUID')),
    body('*.reg_date', '요청일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '요청일시'))
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '요청일시')),
    body('*.proc_uuid', '공정UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'proc_uuid', '공정UUID')),
    
  ],
  updateComplete: [
    
  ],
  update: [
    
  ],
  patch: [
    
  ],
  delete: [
    body('*.uuid', '출고요청UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '출고요청UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '출고요청UUID'))
  ],
};

export default prdDemandValidation;