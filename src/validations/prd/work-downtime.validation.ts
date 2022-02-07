import { param, query, body } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'prdWorkDowntime';

const prdWorkDowntimeValidation = {
  readReport: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('sort_type', '정렬기준')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sort_type', '정렬기준'))
      .isIn([ 'proc', 'equip', 'downtime' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'sort_type', '정렬기준')),
    query('work_start_date', '실적기준 시작일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_start_date', '실적기준 시작일시')),
    query('work_end_date', '실적기준 종료일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_end_date', '실적기준 종료일시')),
    query('downtime_start_date', '비가동기준 시작일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'downtime_start_date', '비가동기준 시작일시')),
    query('downtime_end_date', '비가동기준 종료일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'downtime_end_date', '비가동기준 종료일시')),
  ],
  read: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('work_uuid', '실적UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'work_uuid', '실적UUID')),
    query('downtime_uuid', '비가동UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'downtime_uuid', '비가동UUID')),
    query('downtime_type_uuid', '비가동유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'downtime_type_uuid', '비가동유형UUID')),
    query('eqm_failure_fg', '설비고장 여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'eqm_failure_fg', '설비고장 여부')),
    query('start_date', '시작일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '시작일시')),
    query('end_date', '종료일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '종료일시')),
  ],
  readByUuid: [
    param('uuid', '비가동UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '비가동UUID'))
  ],
  create: [
    body('*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('*.work_uuid', '실적UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_uuid', '실적UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'order_uuid', '지시UUID')),
    body('*.work_routing_uuid', '공정순서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_routing_uuid', '공정순서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_routing_uuid', '지시UUID')),
    body('*.downtime_uuid', '비가동UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'downtime_uuid', '비가동UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'downtime_uuid', '비가동UUID')),
    body('*.start_date', '비가동 시작일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '비가동 시작일시')),
    body('*.end_date', '비가동 종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '비가동 종료일시')),
    body('*.downtime', '비가동시간').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'downtime', '비가동시간')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  update: [
    body('*.uuid', '비가동UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '비가동UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '비가동UUID')),
    body('*.start_date', '비가동 시작일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '비가동 시작일시')),
    body('*.end_date', '비가동 종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '비가동 종료일시')),
    body('*.downtime', '비가동시간').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'downtime', '비가동시간')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  patch: [
    body('*.uuid', '비가동UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '비가동UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '비가동UUID')),
    body('*.start_date', '비가동 시작일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '비가동 시작일시')),
    body('*.end_date', '비가동 종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '비가동 종료일시')),
    body('*.downtime', '비가동시간').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'downtime', '비가동시간')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  delete: [
    body('*.uuid', '비가동UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '비가동UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '비가동UUID'))
  ],
};

export default prdWorkDowntimeValidation;