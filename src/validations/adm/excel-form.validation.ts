
import { body, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'admExcelForm';

const admExcelFormValidation = {
	readByMenu: [
  ],
  read: [
		query('excel_form_cd', '파일관리 유형UUID').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'excel_form_cd', '엑셀 양식 코드')),
  ],
	excelFormDownload: [
		query('excel_form_cd', '파일관리 유형UUID').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'excel_form_cd', '엑셀 양식 코드')),
  ],
  create: [
    body('*.menu_uuid', '메뉴UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'menu_uuid', '메뉴UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'menu_uuid', '메뉴UUID')),
    body('*.excel_form_cd', '엑세 양식 코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'excel_form_cd', '엑셀 양식 코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_cd', '엑셀 양식 코드')),
    body('*.excel_form_nm', '엑셀 양식 명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'excel_form_nm', '엑셀 양식 명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_nm', '엑셀 양식 명')),
		body('*.excel_form_column_nm', '엑셀 양식 컬럼 명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'excel_form_column_nm', '엑셀 양식 컬럼 명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_column_nm', '엑셀 양식 컬럼 명')),
		body('*.excel_form_column_cd', '엑셀 양식 컬럼 코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'excel_form_column_cd', '엑셀 양식 컬럼 코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_column_cd', '엑셀 양식 컬럼 코드')),
		body('*.excel_form_type', '엑셀 양식 컬럼 타입')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'excel_form_type', '엑셀 양식 컬럼 타입'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_type', '엑셀 양식 컬럼 타입')),
		body('*.column_fg', '엑셀 양식 컬럼 필수값').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'column_fg', '엑셀 양식 컬럼 필수값')),
		body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
  ],
  update: [
    body('*.uuid', '엑셀 양식 UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '엑셀 양식 UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '엑셀 양식 UUID')),
		body('*.excel_form_cd', '엑세 양식 코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'excel_form_cd', '엑셀 양식 코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_cd', '엑셀 양식 코드')),
    body('*.excel_form_nm', '엑셀 양식 명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'excel_form_nm', '엑셀 양식 명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_nm', '엑셀 양식 명')),
		body('*.excel_form_column_nm', '엑셀 양식 컬럼 명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'excel_form_column_nm', '엑셀 양식 컬럼 명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_column_nm', '엑셀 양식 컬럼 명')),
		body('*.excel_form_column_cd', '엑셀 양식 컬럼 코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'excel_form_column_cd', '엑셀 양식 컬럼 코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_column_cd', '엑셀 양식 컬럼 코드')),
		body('*.excel_form_type', '엑셀 양식 컬럼 타입')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'excel_form_type', '엑셀 양식 컬럼 타입'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_type', '엑셀 양식 컬럼 타입')),
		body('*.column_fg', '엑셀 양식 컬럼 필수값').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'column_fg', '엑셀 양식 컬럼 필수값')),
		body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
  ],
  patch: [
    body('*.uuid', '엑셀 양식 UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '엑셀 양식 UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '엑셀 양식 UUID')),
		body('*.excel_form_cd', '엑세 양식 코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_cd', '엑셀 양식 코드')),
    body('*.excel_form_nm', '엑셀 양식 명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_nm', '엑셀 양식 명')),
		body('*.excel_form_column_nm', '엑셀 양식 컬럼 명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_column_nm', '엑셀 양식 컬럼 명')),
		body('*.excel_form_column_cd', '엑셀 양식 컬럼 코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_column_cd', '엑셀 양식 컬럼 코드')),
		body('*.excel_form_type', '엑셀 양식 컬럼 타입').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'excel_form_type', '엑셀 양식 컬럼 타입')),
		body('*.column_fg', '엑셀 양식 컬럼 필수값').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'column_fg', '엑셀 양식 컬럼 필수값')),
		body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
    ],
  delete: [
    body('*.uuid', '엑셀 양식 UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '엑셀 양식 UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '엑셀 양식 UUID')),
  ],
};

export default admExcelFormValidation;