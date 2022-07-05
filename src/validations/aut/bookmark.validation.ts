import { body, param } from "express-validator";
import { errorState } from "../../states/common.state";
import createValidationError from "../../utils/createValidationError";

const stateTag = 'autBookmark';

const autBookmarkValidation = {
  read: [

  ],
  readByUuid: [
    param('uuid', '즐겨찾기UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '즐겨찾기UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '즐겨찾기UUID'))
  ],
  create: [
    body('*.menu_uuid', '메뉴UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'menu_uuid', '메뉴UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'menu_uuid', '메뉴UUID')),
  ],
  delete: [
    body('*.uuid', '즐겨찾기UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '즐겨찾기UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '즐겨찾기UUID')),
  ],
  deleteByMenuUuid: [
    body('*.menu_uuid', '메뉴UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'menu_uuid', '메뉴UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'menu_uuid', '메뉴UUID')),
  ],
}

export default autBookmarkValidation;