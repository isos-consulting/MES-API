import { body, param } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'autMenuType';

const autMenuTypeValidation = {
  read: [
    
  ],
  readByUuid: [ 
    param('uuid', '메뉴유형UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '메뉴유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '메뉴유형UUID'))
  ],
  create: [
    body('*.menu_type_nm', '메뉴유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'menu_type_nm', '메뉴유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'menu_type_nm', '메뉴유형명')),
    body('*.create_fg', '데이터 생성 권한')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'create_fg', '데이터 생성 권한'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'create_fg', '데이터 생성 권한')),
		body('*.read_fg', '데이터 조회 권한')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'read_fg', '데이터 조회 권한'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'read_fg', '데이터 조회 권한')),
		body('*.update_fg', '데이터 수정 권한')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'update_fg', '데이터 수정 권한'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'update_fg', '데이터 수정 권한')),
		body('*.delete_fg', '데이터 삭제 권한')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'delete_fg', '데이터 삭제 권한'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'delete_fg', '데이터 삭제 권한'))
  ],
  update: [
		body('*.uuid', '메뉴유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '메뉴유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '메뉴유형UUID')),
    body('*.menu_type_nm', '메뉴유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'menu_type_nm', '메뉴유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'menu_type_nm', '메뉴유형명')),
    body('*.create_fg', '데이터 생성 권한')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'create_fg', '데이터 생성 권한'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'create_fg', '데이터 생성 권한')),
		body('*.read_fg', '데이터 조회 권한')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'read_fg', '데이터 조회 권한'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'read_fg', '데이터 조회 권한')),
		body('*.update_fg', '데이터 수정 권한')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'update_fg', '데이터 수정 권한'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'update_fg', '데이터 수정 권한')),
		body('*.delete_fg', '데이터 삭제 권한')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'delete_fg', '데이터 삭제 권한'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'delete_fg', '데이터 삭제 권한'))
  ],
  patch: [
    body('*.uuid', '메뉴유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '메뉴유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '메뉴유형UUID')),
    body('*.menu_type_nm', '메뉴유형명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'menu_type_nm', '메뉴유형명')),
    body('*.create_fg', '데이터 생성 권한').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'create_fg', '데이터 생성 권한')),
		body('*.read_fg', '데이터 조회 권한').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'read_fg', '데이터 조회 권한')),
		body('*.update_fg', '데이터 수정 권한').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'update_fg', '데이터 수정 권한')),
		body('*.delete_fg', '데이터 삭제 권한').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'delete_fg', '데이터 삭제 권한'))
  ],
  delete: [
    body('*.uuid', '메뉴유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '메뉴유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '메뉴유형UUID'))
  ],
};

export default autMenuTypeValidation;