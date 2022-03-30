import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdStore';

const stdStoreValidation = {
	upsertBulkDatasFromExcel: [
		query('uuid', '창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '창고UUID')),
		query('factory_cd', '공장코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_cd', '공장코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_cd', '공장코드')),
		query('store_cd', '창고코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'store_cd', '창고코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'store_cd', '창고코드')),
		query('store_nm', '창고명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'store_nm', '창고명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'store_nm', '창고명')),
		query('reject_store_fg', '부적합창고 유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_store_fg', '부적합창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'reject_store_fg', '부적합창고 유무')),
		query('return_store_fg', '반출창고 유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'return_store_fg', '반출창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'return_store_fg', '반출창고 유무')),
		query('outgo_store_fg', '출하창고 유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'outgo_store_fg', '출하창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'outgo_store_fg', '출하창고 유무')),
		query('final_insp_store_fg', '최종검사 창고 유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'final_insp_store_fg', '최종검사 창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'final_insp_store_fg', '최종검사 창고 유무')),
		query('outsourcing_store_fg', '외주 창고 유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'outsourcing_store_fg', '외주 창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'outsourcing_store_fg', '외주 창고 유무')),
		query('available_store_fg', '가용재고 창고 유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'available_store_fg', '가용재고 창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'available_store_fg', '가용재고 창고 유무')),
		query('position_type', '창고 위치 유형(사내/사외)')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'position_type', '창고 위치 유형(사내/사외)'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'position_type', '창고 위치 유형(사내/사외)')),
	],
	read:[
		query('store_type', '창고조회유형').optional({ nullable: true })
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'store_type', '창고조회유형'))
      .isIn([ 'all', 'available', 'reject', 'return', 'outgo', 'finalInsp', 'outsourcing' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'store_type', '창고조회유형')),
		query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
	],
  readByUuid: [ 
    param('uuid', '창고UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '창고UUID'))
  ],
  create: [
		body('*.factory_uuid', '창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '창고UUID')),
		body('*.store_cd', '창고코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'store_cd', '창고코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_cd', '창고코드')),
		body('*.store_nm', '창고명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'store_nm', '창고명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_nm', '창고명')),
		body('*.reject_store_fg', '부적합창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_store_fg', '부적합창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_store_fg', '부적합창고 유무')),
		body('*.return_store_fg', '반출창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'return_store_fg', '반출창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'return_store_fg', '반출창고 유무')),
		body('*.outgo_store_fg', '출하창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'outgo_store_fg', '출하창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'outgo_store_fg', '출하창고 유무')),
		body('*.final_insp_store_fg', '최종검사 창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'final_insp_store_fg', '최종검사 창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'final_insp_store_fg', '최종검사 창고 유무')),
		body('*.outsourcing_store_fg', '외주 창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'outsourcing_store_fg', '외주 창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'outsourcing_store_fg', '외주 창고 유무')),
		body('*.available_store_fg', '가용재고 창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'available_store_fg', '가용재고 창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'available_store_fg', '가용재고 창고 유무')),
		body('*.position_type', '창고 위치 유형(사내/사외)')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'position_type', '창고 위치 유형(사내/사외)'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'position_type', '창고 위치 유형(사내/사외)')),
	],
  update: [
    body('*.uuid', '창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '창고UUID')),
		body('*.store_cd', '창고코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'store_cd', '창고코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_cd', '창고코드')),
		body('*.store_nm', '창고명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'store_nm', '창고명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_nm', '창고명')),
		body('*.reject_store_fg', '부적합창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_store_fg', '부적합창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_store_fg', '부적합창고 유무')),
		body('*.return_store_fg', '반출창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'return_store_fg', '반출창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'return_store_fg', '반출창고 유무')),
		body('*.outgo_store_fg', '출하창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'outgo_store_fg', '출하창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'outgo_store_fg', '출하창고 유무')),
		body('*.final_insp_store_fg', '최종검사 창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'final_insp_store_fg', '최종검사 창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'final_insp_store_fg', '최종검사 창고 유무')),
		body('*.outsourcing_store_fg', '외주 창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'outsourcing_store_fg', '외주 창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'outsourcing_store_fg', '외주 창고 유무')),
		body('*.available_store_fg', '가용재고 창고 유무')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'available_store_fg', '가용재고 창고 유무'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'available_store_fg', '가용재고 창고 유무')),
		body('*.position_type', '창고 위치 유형(사내/사외)')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'position_type', '창고 위치 유형(사내/사외)'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'position_type', '창고 위치 유형(사내/사외)')),
  ],
  patch: [
    body('*.uuid', '창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '창고UUID')),
		body('*.store_cd', '창고코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_cd', '창고코드')),
		body('*.store_nm', '창고명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_nm', '창고명')),
		body('*.reject_store_fg', '부적합창고 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_store_fg', '부적합창고 유무')),
		body('*.return_store_fg', '반출창고 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'return_store_fg', '반출창고 유무')),
		body('*.outgo_store_fg', '출하창고 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'outgo_store_fg', '출하창고 유무')),
		body('*.final_insp_store_fg', '최종검사 창고 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'final_insp_store_fg', '최종검사 창고 유무')),
		body('*.outsourcing_store_fg', '외주 창고 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'outsourcing_store_fg', '외주 창고 유무')),
		body('*.available_store_fg', '가용재고 창고 유무').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'available_store_fg', '가용재고 창고 유무')),
		body('*.position_type', '창고 위치 유형(사내/사외)').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'position_type', '창고 위치 유형(사내/사외)')),
  ],
  delete: [
    body('*.uuid', '창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '창고UUID'))
  ],
};

export default stdStoreValidation;