import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdPartner';

const stdPartnerValidation = {
	upsertBulkDatasFromExcel: [
		body('*.uuid', '거래처UUID').optional({ nullable: true })
         .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '거래처UUID')),
		body('*.partner_cd', '거래처코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_cd', '거래처코드'))
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_cd', '거래처코드')),
		body('*.partner_nm', '거래처명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_nm', '거래처명'))
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_nm', '거래처명')),
		body('*.partner_type_cd', '거래처유형코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_type_cd', '거래처유형코드'))
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_type_cd', '거래처유형코드')),
		body('*.partner_no', '거래처 사업자등록번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_no', '거래처 사업자등록번호')),
		body('*.boss_nm', '거래처 대표자명').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'boss_nm', '대표자명')),
		body('*.manager', '담당자').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'manager', '담당자')),
		body('*.email', '이메일').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'email', '이메일')),
		body('*.tel', '전화번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'tel', '전화번호')),
		body('*.fax', '팩스번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'fax', '팩스번호')),
		body('*.post', '우편번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'post', '우편번호')),
		body('*.addr', '주소').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr', '주소')),
		body('*.addr_detail', '상세주소').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr_detail', '상세주소')),
		body('*.use_fg', '사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'use_fg', '사용유무'))
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'use_fg', '사용유무')),
		body('*.customer_fg', '매출처유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'customer_fg', '매출처유무'))
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'customer_fg', '매출처유무')),
		body('*.remark', '비고').optional({ nullable: true })
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'remark', '비고')),
	],
	read: [
		query('partner_type_uuid', '거래처유형UUID').optional({ nullable: true })
         .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_type_uuid', '거래처유형UUID')),
		query('partner_fg','고객사 협력사 구분').optional({ nullable: true })
         .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_fg', '고객사 협력사 구분')),
	],
  readByUuid: [ 
    param('uuid', '거래처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '거래처UUID'))
  ],
  create: [
       body('*.partner_cd', '거래처코드')
         .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_type_cd', '거래처코드'))
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_type_cd', '거래처코드')),
		body('*.partner_nm', '거래처명')
         .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_nm', '거래처명'))
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_nm', '거래처명')),
		body('*.partner_type_uuid', '거래처 유형UUID')
         .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_type_uuid', '거래처 유형UUID'))
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_type_uuid', '거래처 유형UUID')),
		body('*.partner_no', '거래처 사업자등록번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_no', '거래처 사업자등록번호')),
		body('*.boss_nm', '대표자명').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'boss_nm', '대표자명')),
		body('*.manager', '담당자').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'manager', '담당자')),
		body('*.email', '이메일').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'email', '이메일')),
		body('*.tel', '전화번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tel', '전화번호')),
		body('*.fax', '팩스번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'fax', '팩스번호')),
		body('*.post', '우편번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'post', '우편번호')),
		body('*.addr', '주소').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'addr', '주소')),
		body('*.addr_detail', '상세주소').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'addr_detail', '상세주소')),
		body('*.use_fg', '사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'use_fg', '사용유무'))
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'use_fg', '사용유무')),
		body('*.vendor_fg', '매입처유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'vendor_fg', '매입처유무'))
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'vendor_fg', '매입처유무')),
		body('*.customer_fg', '매출처유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'customer_fg', '매출처유무'))
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'customer_fg', '매출처유무')),
		body('*.remark', '비고').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
	],
  update: [
      body('*.uuid', '거래처UUID')
         .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '거래처UUID'))
         .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '거래처UUID')),
		body('*.partner_cd', '거래처코드')
         .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_cd', '거래처코드'))
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_cd', '거래처코드')),
      body('*.partner_nm', '거래처명')
         .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_nm', '거래처명'))
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_nm', '거래처명')),
		body('*.partner_type_uuid', '거래처 유형UUID')
         .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_type_uuid', '거래처 유형UUID'))
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_type_uuid', '거래처 유형UUID')),
		body('*.partner_no', '거래처 사업자등록번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_no', '거래처 사업자등록번호')),
		body('*.boss_nm', '대표자명').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'boss_nm', '대표자명')),
		body('*.manager', '담당자').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'manager', '담당자')),
		body('*.email', '이메일').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'email', '이메일')),
		body('*.tel', '전화번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tel', '전화번호')),
		body('*.fax', '팩스번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'fax', '팩스번호')),
		body('*.post', '우편번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'post', '우편번호')),
		body('*.addr', '주소').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'addr', '주소')),
		body('*.addr_detail', '상세주소').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'addr_detail', '상세주소')),
		body('*.use_fg', '사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'use_fg', '사용유무'))
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'use_fg', '사용유무')),
		body('*.vendor_fg', '매입처유무').optional({ nullable: true })
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'vendor_fg', '매입처유무')),
		body('*.customer_fg', '매출처유무').optional({ nullable: true })
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'customer_fg', '매출처유무')),
		body('*.remark', '비고').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  patch: [
      body('*.uuid', '거래처UUID')
         .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '거래처UUID'))
         .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '거래처UUID')),
      body('*.partner_cd', '거래처코드').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_cd', '거래처코드')),
      body('*.partner_nm', '거래처명').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_nm', '거래처명')),
		body('*.partner_type_uuid', '거래처 유형UUID').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_type_uuid', '거래처 유형UUID')),
		body('*.partner_no', '거래처 사업자등록번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_no', '거래처 사업자등록번호')),
		body('*.boss_nm', '대표자명').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'boss_nm', '대표자명')),
		body('*.manager', '담당자').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'manager', '담당자')),
		body('*.email', '이메일').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'email', '이메일')),
		body('*.tel', '전화번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tel', '전화번호')),
		body('*.fax', '팩스번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'fax', '팩스번호')),
		body('*.post', '우편번호').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'post', '우편번호')),
		body('*.addr', '주소').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'addr', '주소')),
		body('*.addr_detail', '상세주소').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'addr_detail', '상세주소')),
		body('*.use_fg', '사용유무').optional({ nullable: true })
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'use_fg', '사용유무')),
		body('*.vendor_fg', '매입처유무').optional({ nullable: true })
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'vendor_fg', '매입처유무')),
		body('*.customer_fg', '매출처유무').optional({ nullable: true })
         .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'customer_fg', '매출처유무')),
		body('*.remark', '비고').optional({ nullable: true })
         .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  delete: [
      body('*.uuid', '거래처UUID')
         .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '거래처UUID'))
         .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '거래처UUID'))
  ],
};

export default stdPartnerValidation;