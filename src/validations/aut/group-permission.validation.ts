import { body, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'autGroupPermission';

const autGroupPermissionValidation = {
  read: [
    query('group_uuid', '그룹UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'group_uuid', '그룹UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'group_uuid', '그룹UUID'))
  ],
  update: [
		body('*.uuid', '그룹별 메뉴권한UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '그룹별 메뉴권한UUID')),
		body('*.group_uuid', '그룹UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'group_uuid', '그룹UUID')),
		body('*.menu_uuid', '메뉴UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'menu_uuid', '메뉴UUID')),
    body('*.permission_uuid', '권한UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'permission_uuid', '권한UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'permission_uuid', '권한UUID'))
  ],
};

export default autGroupPermissionValidation;