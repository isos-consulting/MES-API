
import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'admFileMgmtDetailType';
   
const admFileMgmtDetailTypeValidation = {
  read: [
    query('file_mgmt_type_uuid', '파일관리 유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'file_mgmt_type_uuid', '파일관리 유형UUID')),
  ],
  readByUuid: [ 
    param('uuid', '파일관리 상세유형UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '파일관리 상세유형UUID'))
  ],
  create: [
    body('*.file_mgmt_detail_type_cd', '파일관리 상세유형코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_mgmt_detail_type_cd', '파일관리 상세유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_detail_type_cd', '파일관리 상세유형코드')),
    body('*.file_mgmt_detail_type_nm', '파일관리 상세유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_mgmt_detail_type_nm', '파일관리 상세유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_detail_type_nm', '파일관리 상세유형명')),
    body('*.file_mgmt_type_uuid', '파일관리 유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_mgmt_type_uuid', '파일관리 유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_type_uuid', '파일관리 유형UUID')),
    body('*.file_extension_types', '파일 확장자 목록').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_extension_types', '파일 확장자 목록')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
  ],
  update: [
    body('*.uuid', '파일관리 상세유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '파일관리 상세유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '파일관리 상세유형UUID')),
    body('*.file_mgmt_detail_type_cd', '파일관리 상세유형코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_mgmt_detail_type_cd', '파일관리 상세유형코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_detail_type_cd', '파일관리 상세유형코드')),
    body('*.file_mgmt_detail_type_nm', '파일관리 상세유형명')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_mgmt_detail_type_nm', '파일관리 상세유형명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_detail_type_nm', '파일관리 상세유형명')),
    body('*.file_mgmt_type_uuid', '파일관리 유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_mgmt_type_uuid', '파일관리 유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_type_uuid', '파일관리 유형UUID')),
    body('*.file_extension_types', '파일 확장자 목록').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_extension_types', '파일 확장자 목록')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
  ],
  patch: [
    body('*.uuid', '파일관리 상세유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '파일관리 상세유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '파일관리 상세유형UUID')),
    body('*.file_mgmt_detail_type_cd', '파일관리 상세유형코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_detail_type_cd', '파일관리 상세유형코드')),
    body('*.file_mgmt_detail_type_nm', '파일관리 상세유형명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_detail_type_nm', '파일관리 상세유형명')),
    body('*.file_mgmt_type_uuid', '파일관리 유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_type_uuid', '파일관리 유형UUID')),
    body('*.file_extension_types', '파일 확장자 목록').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_extension_types', '파일 확장자 목록')),
    body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬'))
    ],
  delete: [
    body('*.uuid', '파일관리 상세유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '파일관리 상세유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '파일관리 상세유형UUID')),
  ],
};

export default admFileMgmtDetailTypeValidation;