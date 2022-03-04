import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'autMenu';

const autMenuValidation = {
  read: [
    query('use_fg', '메뉴사용여부').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'use_fg', '메뉴사용여부'))
  ],
  readByUuid: [ 
    param('uuid', '메뉴UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '메뉴UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '메뉴UUID'))
  ],
	create: [

	],
  update: [
		body('*.uuid', '메뉴UUID').optional({ nullable: true })
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '메뉴UUID')),
      // .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '메뉴UUID')),
    body('*.lv', '메뉴 레벨')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lv', '메뉴 레벨'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lv', '메뉴 레벨')),
    body('*.menu_type_uuid', '메뉴유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'menu_type_uuid', '메뉴유형UUID')),
		body('*.menu_nm', '메뉴명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'menu_nm', '메뉴명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'menu_nm', '메뉴명')),
		body('*.menu_uri', '메뉴URI').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'menu_uri', '메뉴URI')),
		body('*.component_nm', '메뉴컴포넌트명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'component_nm', '메뉴컴포넌트명')),
		body('*.icon', '메뉴 아이콘 파일명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'icon', '메뉴 아이콘 파일명')),
		body('*.use_fg', '메뉴 사용여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'use_fg', '메뉴 사용여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'use_fg', '메뉴 사용여부'))
  ],
	patch: [

	],
  delete: [
    body('*.uuid', '메뉴UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '메뉴UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '메뉴UUID'))
  ],
};

export default autMenuValidation;