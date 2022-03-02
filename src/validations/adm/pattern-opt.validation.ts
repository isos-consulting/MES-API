import { body, param } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'admPatternOpt';

const admPatternOptValidation = {
  read: [],
  readByUuid: [ 
    param('uuid', '번호자동발행 옵션UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '번호자동발행 옵션UUID'))
  ],
  create: [
    body('*.pattern_opt_cd', '번호자동발행 옵션코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'pattern_opt_cd', '번호자동발행 옵션코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pattern_opt_cd', '번호자동발행 옵션코드')),
    body('*.pattern_opt_nm', '번호자동발행 옵션명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'pattern_opt_nm', '번호자동발행 옵션명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pattern_opt_nm', '번호자동발행 옵션명')),
    body('*.table_nm', '테이블명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'table_nm', '테이블명')),
    body('*.auto_fg', '자동발행여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'auto_fg', '자동발행여부')),
    body('*.col_nm', '컬럼명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'col_nm', '컬럼명')),
    body('*.pattern', '패턴').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pattern', '패턴')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
  ],
  update: [
    body('*.uuid', '번호자동발행 옵션UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '번호자동발행 옵션UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '번호자동발행 옵션UUID')),
    body('*.pattern_opt_cd', '번호자동발행 옵션코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'pattern_opt_cd', '번호자동발행 옵션코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pattern_opt_cd', '번호자동발행 옵션코드')),
    body('*.pattern_opt_nm', '번호자동발행 옵션명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'pattern_opt_nm', '번호자동발행 옵션명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pattern_opt_nm', '번호자동발행 옵션명')),
    body('*.table_nm', '테이블명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'table_nm', '테이블명')),
    body('*.auto_fg', '자동발행여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'auto_fg', '자동발행여부')),
    body('*.col_nm', '컬럼명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'col_nm', '컬럼명')),
    body('*.pattern', '패턴').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pattern', '패턴')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
  ],
  patch: [
    body('*.uuid', '번호자동발행 옵션UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '번호자동발행 옵션UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '번호자동발행 옵션UUID')),
    body('*.pattern_opt_cd', '번호자동발행 옵션코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pattern_opt_cd', '번호자동발행 옵션코드')),
    body('*.pattern_opt_nm', '번호자동발행 옵션명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pattern_opt_nm', '번호자동발행 옵션명')),
    body('*.table_nm', '테이블명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'table_nm', '테이블명')),
    body('*.auto_fg', '자동발행여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'auto_fg', '자동발행여부')),
    body('*.col_nm', '컬럼명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'col_nm', '컬럼명')),
    body('*.pattern', '패턴').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pattern', '패턴')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
  ],
  delete: [
    body('*.uuid', '번호자동발행 옵션UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '번호자동발행 옵션UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '번호자동발행 옵션UUID'))
  ],
};

export default admPatternOptValidation;