import { body, param } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdWorktimeType';

const stdWorktimeValidation = {
	read: [

	],
  readByUuid: [ 
    param('uuid', '근무시간UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '근무시간UUID'))
  ],
  create: [
    body('*.worktime_cd', '근무시간코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'worktime_cd', '근무시간코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_cd', '근무시간코드')),
    body('*.worktime_nm', '근무시간명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'worktime_nm', '근무시간명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_nm', '근무시간명')),
    body('*.work_type_uuid', '근무유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_type_uuid', '근무유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_type_uuid', '근무유형UUID')),
    body('*.worktime_type_uuid', '근무시간유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'worktime_type_uuid', '근무시간유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_type_uuid', '근무시간유형UUID')),
    body('*.use_fg', '사용여부')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'use_fg', '사용여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'use_fg', '사용여부')),
    body('*.break_time_fg', '휴게시간여부')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'break_time_fg', '휴게시간여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'break_time_fg', '휴게시간여부')),
    body('*.start_time', '시작시간')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_time', '시작시간'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_time', '시작시간')),
    body('*.end_time', '종료시간')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'end_time', '종료시간'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_time', '종료시간')),
	],
  update: [
    body('*.uuid', '근무시간UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '근무시간UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '근무시간UUID')),
    body('*.worktime_cd', '근무시간코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'worktime_cd', '근무시간코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_cd', '근무시간코드')),
    body('*.worktime_nm', '근무시간명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'worktime_nm', '근무시간명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_nm', '근무시간명')),
    body('*.work_type_uuid', '근무유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_type_uuid', '근무유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_type_uuid', '근무유형UUID')),
    body('*.worktime_type_uuid', '근무시간유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'worktime_type_uuid', '근무시간유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_type_uuid', '근무시간유형UUID')),
    body('*.use_fg', '사용여부')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'use_fg', '사용여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'use_fg', '사용여부')),
    body('*.break_time_fg', '휴게시간여부')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'break_time_fg', '휴게시간여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'break_time_fg', '휴게시간여부')),
    body('*.start_time', '시작시간')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_time', '시작시간'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_time', '시작시간')),
    body('*.end_time', '종료시간')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'end_time', '종료시간'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_time', '종료시간')),
  ],
  patch: [
    body('*.uuid', '근무시간UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '근무시간UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '근무시간UUID')),
    body('*.worktime_cd', '근무시간코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_cd', '근무시간코드')),
    body('*.worktime_nm', '근무시간명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_nm', '근무시간명')),
    body('*.work_type_uuid', '근무유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_type_uuid', '근무유형UUID')),
    body('*.worktime_type_uuid', '근무시간유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'worktime_type_uuid', '근무시간유형UUID')),
    body('*.use_fg', '사용여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'use_fg', '사용여부')),
    body('*.break_time_fg', '휴게시간여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'break_time_fg', '휴게시간여부')),
    body('*.start_time', '시작시간').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_time', '시작시간')),
    body('*.end_time', '종료시간').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_time', '종료시간')),
  ],
  delete: [
    body('*.uuid', '근무시간UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '근무시간UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '근무시간UUID'))
  ],
};

export default stdWorktimeValidation;