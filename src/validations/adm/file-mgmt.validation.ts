
import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'admFileMgmt';
   
const admFileMgmtValidation = {
  read: [
    query('file_mgmt_type_uuid', '파일관리 유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'file_mgmt_type_uuid', '파일관리 유형UUID')),
    query('file_mgmt_detail_type_uuid', '파일관리 상세유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'file_mgmt_detail_type_uuid', '파일관리 상세유형UUID')),
    query('reference_uuid', '파일관련 테이블 Row UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'reference_uuid', '파일관련 테이블 Row UUID')),
  ],
  readByUuid: [ 
    param('uuid', '파일UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '파일UUID'))
  ],
  create: [
    body('*.uuid', '파일UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '파일UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '파일UUID')),
    body('*.save_type', '파일 생성/삭제 구분')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'save_type', '파일 생성/삭제 구분'))
      .isIn([ 'CREATE', 'DELETE' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'save_type', '파일 생성/삭제 구분')),
    body('*.file_mgmt_detail_type_uuid', '파일관리 상세유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_mgmt_detail_type_uuid', '파일관리 상세유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_detail_type_uuid', '파일관리 상세유형UUID')),
    body('*.reference_uuid', '파일관련 테이블 Row UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reference_uuid', '파일관련 테이블 Row UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reference_uuid', '파일관련 테이블 Row UUID')),
    body('*.file_nm', '파일명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_nm', '파일명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_nm', '파일명')),
    body('*.file_extension', '파일 확장자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_extension', '파일 확장자'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_extension', '파일 확장자')),
    body('*.file_size', '파일 용량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_size', '파일 용량'))
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_size', '파일 용량')),
    body('*.ip', 'IP Address').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'ip', 'IP Address')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  update: [
    body('*.uuid', '파일UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '파일UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '파일UUID')),
    body('*.file_nm', '파일명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_nm', '파일명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_nm', '파일명')),
    body('*.file_extension', '파일 확장자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_extension', '파일 확장자'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_extension', '파일 확장자')),
    body('*.ip', 'IP Address').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'ip', 'IP Address')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  patch: [
    body('*.uuid', '파일UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '파일UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '파일UUID')),
    body('*.file_nm', '파일명').optional({ nullable: true })
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_nm', '파일명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_nm', '파일명')),
    body('*.file_extension', '파일 확장자').optional({ nullable: true })
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_extension', '파일 확장자'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_extension', '파일 확장자')),
    body('*.ip', 'IP Address').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'ip', 'IP Address')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
    ],
  delete: [
    body('*.uuid', '파일UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '파일UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '파일UUID')),
  ],
};

export default admFileMgmtValidation;