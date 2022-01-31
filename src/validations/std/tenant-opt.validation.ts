import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdTenantOpt';

const stdTenantOptValidation = {
  read: [
    query('tenant_opt_cd', '사용자정의옵션코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'tenant_opt_cd', '사용자정의옵션코드'))
  ],
  readByUuid: [ 
    param('uuid', '사용자정의옵션UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '사용자정의옵션UUID'))
  ],
  create: [
    body('*.tenant_opt_cd', '사용자정의옵션코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'tenant_opt_cd', '사용자정의옵션코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tenant_opt_cd', '사용자정의옵션코드')),
    body('*.tenant_opt_nm', '사용자정의옵션명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'tenant_opt_nm', '사용자정의옵션명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tenant_opt_nm', '사용자정의옵션명')),
    body('*.value', '사용자정의옵션 값')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'value', '사용자정의옵션 값'))
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'value', '사용자정의옵션 값')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  update: [
    body('*.uuid', '사용자정의옵션UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '사용자정의옵션UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '사용자정의옵션UUID')),
    body('*.tenant_opt_cd', '사용자정의옵션코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'tenant_opt_cd', '사용자정의옵션코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tenant_opt_cd', '사용자정의옵션코드')),
    body('*.tenant_opt_nm', '사용자정의옵션명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'tenant_opt_nm', '사용자정의옵션명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tenant_opt_nm', '사용자정의옵션명')),
    body('*.value', '사용자정의옵션 값')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'value', '사용자정의옵션 값'))
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'value', '사용자정의옵션 값')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  patch: [
    body('*.uuid', '사용자정의옵션UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '사용자정의옵션UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '사용자정의옵션UUID')),
    body('*.tenant_opt_cd', '사용자정의옵션코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tenant_opt_cd', '사용자정의옵션코드')),
    body('*.tenant_opt_nm', '사용자정의옵션명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tenant_opt_nm', '사용자정의옵션명')),
    body('*.value', '사용자정의옵션 값').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'value', '사용자정의옵션 값')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  delete: [
    body('*.uuid', '사용자정의옵션UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '사용자정의옵션UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '사용자정의옵션UUID'))
  ],
};

export default stdTenantOptValidation;