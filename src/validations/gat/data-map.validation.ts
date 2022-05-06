
import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdDataMap';
  
const stdDataMapValidation = {
  read: [
    query('data_item_uuid', '인터페이스 항목UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'data_item_uuid', '인터페이스 항목UUID')),
		query('data_gear_uuid', '인터페이스 매핑UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'data_gear_uuid', '인터페이스 장비UUID')),
		query('equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'equip_uuid', '설비UUID')),
		query('monitoring_fg', '모니터링 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'monitoring_fg', '모니터링 유무')),
  ],
  readByUuid: [ 
    param('uuid', '인테페이스 매핑UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '인테페이스 매핑UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '인테페이스 매핑UUID'))
  ],
  create: [
		body('*.data_item_uuid', '인터페이스 항목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_item_uuid', '인터페이스 항목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_item_uuid', '인터페이스 항목UUID')),
		body('*.data_gear_uuid', '인터페이스 장비UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_gear_uuid', '인터페이스 장비UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_gear_uuid', '인터페이스 장비UUID')),
		body('*.equip_uuid', '설비UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'equip_uuid', '설비UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.data_map_nm', '인터페이스 매핑 명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_map_nm', '인터페이스 매핑 명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_map_nm', '인터페이스 매핑 명')),
		body('*.data_channel', '채널')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_channel', '채널'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_channel', '채널')),
		body('*.history_yn', 'history 유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'history_yn', 'history 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'history_yn', 'history 유무')),
		body('*.weight', '가중치').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'weight', '가중치')),
		body('*.work_fg', 'real-time 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_fg', 'real-time 유무')),
		body('*.community_function', 'Modbus function').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'community_function', 'Modbus function')),
		body('*.slave', 'Modbus slave').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'slave', 'Modbus slave')),
		body('*.alarm_fg', '알림유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'alarm_fg', '알림유무')),
		body('*.ieee752_fg', '부동소수점 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'ieee752_fg', 'real-time 유무')),
		body('*.monitoring_fg', '모니터링 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'monitoring_fg', '모니터링 유무')),

  ],
  update: [
    body('*.uuid', '인테페이스 매핑UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '인테페이스 매핑UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '인테페이스 매핑UUID')),
		body('*.data_item_uuid', '인터페이스 항목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_item_uuid', '인터페이스 항목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_item_uuid', '인터페이스 항목UUID')),
		body('*.data_gear_uuid', '인터페이스 장비UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_gear_uuid', '인터페이스 장비UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_gear_uuid', '인터페이스 장비UUID')),
		body('*.equip_uuid', '설비UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'equip_uuid', '설비UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.data_map_nm', '인터페이스 매핑 명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_map_nm', '인터페이스 매핑 명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_map_nm', '인터페이스 매핑 명')),
		body('*.data_channel', '채널')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_channel', '채널'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_channel', '채널')),
		body('*.history_yn', 'history 유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'history_yn', 'history 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'history_yn', 'history 유무')),
		body('*.weight', '가중치').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'weight', '가중치')),
		body('*.work_fg', 'real-time 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_fg', 'real-time 유무')),
		body('*.community_function', 'Modbus function').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'community_function', 'Modbus function')),
		body('*.slave', 'Modbus slave').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'slave', 'Modbus slave')),
		body('*.alarm_fg', '알림유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'alarm_fg', '알림유무')),
		body('*.ieee752_fg', '부동소수점 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'ieee752_fg', 'real-time 유무')),
		body('*.monitoring_fg', '모니터링 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'monitoring_fg', '모니터링 유무')),
  ],
  patch: [
    body('*.uuid', '인테페이스 매핑UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '인테페이스 매핑UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '인테페이스 매핑UUID')),
		body('*.data_item_uuid', '인터페이스 항목UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_item_uuid', '인터페이스 항목UUID')),
		body('*.data_gear_uuid', '인터페이스 장비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_gear_uuid', '인터페이스 장비UUID')),
		body('*.equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.data_map_nm', '인터페이스 매핑 명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_map_nm', '인터페이스 매핑 명')),
		body('*.data_channel', '채널').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_channel', '채널')),
		body('*.history_yn', 'history 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'history_yn', 'history 유무')),
		body('*.weight', '가중치').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'weight', '가중치')),
		body('*.work_fg', 'real-time 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_fg', 'real-time 유무')),
		body('*.community_function', 'Modbus function').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'community_function', 'Modbus function')),
		body('*.slave', 'Modbus slave').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'slave', 'Modbus slave')),
		body('*.alarm_fg', '알림유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'alarm_fg', '알림유무')),
		body('*.ieee752_fg', '부동소수점 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'ieee752_fg', 'real-time 유무')),
		body('*.monitoring_fg', '모니터링 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'monitoring_fg', '모니터링 유무')),
    
    ],
  delete: [
    body('*.uuid', '인테페이스 매핑UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '인테페이스 매핑UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '인테페이스 매핑UUID')),
  ],
};

export default stdDataMapValidation;