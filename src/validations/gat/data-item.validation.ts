
import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdDataItem';
  
const stdDataItemValidation = {
  read: [
    query('monitoring_fg', '모니터링 여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'monitoring_fg', '모니터링 여부'))
  ],
  readByUuid: [ 
    param('uuid', '인테페이스 항목UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '인테페이스 항목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '인테페이스 항목UUID'))
  ],
  create: [
    body('*.data_item_cd', '인터페이스 항목 코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_item_cd', '인터페이스 항목 코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_item_cd', '인터페이스 항목 코드')),
    body('*.data_item_nm', '인터페이스 항목 명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_item_nm', '인터페이스 항목 명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_item_nm', '인터페이스 항목 명')),
		body('*.monitoring_fg', '모니터링 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'monitoring_fg', '모니터링 유무'))
  ],
  update: [
    body('*.uuid', '인테페이스 항목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '인테페이스 항목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '인테페이스 항목UUID')),
    body('*.data_item_cd', '인터페이스 항목 코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_item_cd', 'data_item_cd'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_item_cd', 'data_item_cd')),
    body('*.data_item_nm', '인터페이스 항목 명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'data_item_nm', '인터페이스 항목 명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_item_nm', '인터페이스 항목 명')),
    body('*.monitoring_fg', '모니터링 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'monitoring_fg', '모니터링 유무'))
  ],
  patch: [
    body('*.uuid', '인테페이스 항목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '인테페이스 항목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '인테페이스 항목UUID')),
    body('*.data_item_cd', '인터페이스 항목 코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'data_item_cd', '인터페이스 항목 코드')),
    body('*.data_item_nm', '인터페이스 항목 명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_nm', '인터페이스 항목 명')),
    body('*.monitoring_fg', '모니터링 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'monitoring_fg', '모니터링 유무'))
    ],
  delete: [
    body('*.uuid', '인테페이스 항목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '인테페이스 항목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '인테페이스 항목UUID')),
  ],
};

export default stdDataItemValidation;