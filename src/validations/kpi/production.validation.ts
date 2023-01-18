import { query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'kpiProduction';

const kpiProductionValidation = {
  readEquipProductivity: [
    query('start_date', '시작일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '기준 시작일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '기준 시작일자')),
    query('end_date', '종료일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'end_date', '기준 종료일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '기준 종료일자')),
		query('workings_uuid', '작업장UUID').optional({ nullable: true })
      .isArray().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'workings_uuid', '작업장UUID')),
  ],
	readDowntime: [
    query('start_date', '시작일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '기준 시작일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '기준 시작일자')),
    query('end_date', '종료일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'end_date', '기준 종료일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '기준 종료일자')),
		query('workings_uuid', '작업장UUID').optional({ nullable: true })
      .isArray().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'workings_uuid', '작업장UUID')),
  ],
	readWorkPlanAchievementRate: [
    query('reg_date', '시작일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '시작일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '시작일자'))
  ],
	readWorkerProductivity: [
    query('start_date', '시작일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '기준 시작일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '기준 시작일자')),
    query('end_date', '종료일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'end_date', '기준 종료일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '기준 종료일자'))
  ],
	readWorkRejectsRate: [
    query('reg_date', '시작일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '시작일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '시작일자'))
  ],
  readOrderWorkRate: [
    query('reg_date', '조회 월')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '조회 월'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '조회 월')),
    query('week_fg', '주차 조회 여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'week_fg', '주차 조회 여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'week_fg', '주차 조회 여부'))
  ],
  readOrderWorkMonthRate: [
    query('reg_date', '조회 월')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '조회 월'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '조회 월')),
  ],
  readWorkerWorkPrice: [
    query('reg_date', '조회 월')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '조회 월'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '조회 월')),
    query('week_fg', '주차 조회 여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'week_fg', '주차 조회 여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'week_fg', '주차 조회 여부'))
  ],
  readWorkerWorkMonthPrice: [
    query('reg_date', '조회 월')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '조회 월'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '조회 월')),
  ],
  readEquipDowntimeType: [
    query('reg_date', '조회 월')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '조회 월'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '조회 월')),
  ],
  readEquipDowntimeTypeMonth: [
    query('reg_date', '조회 월')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '조회 월'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '조회 월')),
  ],
};

export default kpiProductionValidation;