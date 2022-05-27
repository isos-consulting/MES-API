import { body, check, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdEmp';

const stdEmpValidation = {
	upsertBulkDatasFromExcel: [
		body('*.uuid', '사원UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '사원UUID')),
		body('*.emp_cd', '사원코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_cd', '사원코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_cd', '사원코드')),
		body('*.emp_nm', '사원명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_nm', '사원명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_nm', '사원명')),
		body('*.id', '사용자 로그인ID').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'id', '사용자 로그인ID')),
		body('*.dept_cd', '부서코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'dept_cd', '부서코드')),
		body('*.grade_cd','직급코드').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'grade_cd', '직급코드')),
		body('*.birthday','생년월일').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'birthday', '생년월일')),
		body('*.addr','주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr', '주소')),
		body('*.addr_detail','상세주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr_detail', '상세주소')),
		body('*.post','우편번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'post', '우편번호')),
		body('*.hp','전화번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'hp', '전화번호')),
		body('*.enter_date','입사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'enter_date', '입사일자')),
		body('*.leave_date','퇴사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'leave_date', '퇴사일자')),
		body('*.worker_fg','작업자유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'worker_fg', '작업자유무')),
		body('*.remark','비고').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'remark', '비고')),
	],
	read: [
		query('emp_status', '재직유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_status', '재직유무'))
			.isIn([ 'all', 'incumbent', 'retiree' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_status', '재직유무')),
		query('worker_fg', '작업자 유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'worker_fg', '작업자 유무'))
	],
  readByUuid: [ 
    param('uuid', '사원UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '사원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '사원UUID'))
  ],
  create: [
		body('*.emp_cd', '사원코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_cd', '사원코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_cd', '사원코드')),
		body('*.emp_nm', '사원명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_nm', '사원명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_nm', '사원명')),
		body('*.user_uuid', '사용자UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'user_uuid', '사용자UUID')),
		body('*.dept_uuid', '부서UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'dept_uuid', '부서UUID')),
		body('*.grade_uuid','직급UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'grade_uuid', '직급UUID')),
		body('*.birthday','생년월일').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'birthday', '생년월일')),
		body('*.addr','주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr', '주소')),
		body('*.addr_detail','상세주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr_detail', '상세주소')),
		body('*.post','우편번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'post', '우편번호')),
		body('*.hp','전화번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'hp', '전화번호')),
		body('*.enter_date','입사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'enter_date', '입사일자')),
		body('*.leave_date','퇴사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'leave_date', '퇴사일자')),
		body('*.worker_fg','작업자유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'worker_fg', '작업자유무')),
		body('*.remark','비고').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'remark', '비고')),
			
		check('*.files').bail(),
		body('*.files', '파일정보').optional({ nullable: true })
			.isArray().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'files', 'files UUID 배열')),
		body('*.files.*.uuid', '파일상세유형 UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '파일UUID'))
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '파일UUID')),	
		body('*.files.*.file_mgmt_detail_type_uuid', '파일상세유형 UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_mgmt_detail_type_uuid', '파일상세유형 UUID'))
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_detail_type_uuid', '파일상세유형 UUID')),
		body('*.files.*.file_nm', '파일명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_nm', '파일명'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_nm', '파일명')),
		body('*.files.*.file_extension', '파일확장자')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_extension', '파일확장자'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_extension', '파일확장자')),
		body('*.files.*.file_size', '파일용량')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_size', '파일용량'))
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_size', '파일용량')),
		body('*.files.*.remark', '파일상세유형 UUID').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'files', 'files UUID 배열'))
	],
  update: [
		body('*.uuid', '사원UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '사원UUID'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '사원UUID')),
		body('*.emp_cd', '사원코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_cd', '사원코드'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_cd', '사원코드')),
    body('*.emp_nm', '사원명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_nm', '사원명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_nm', '사원명')),
		body('*.user_uuid', '사용자UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'user_uuid', '사용자UUID')),
		body('*.dept_uuid', '부서UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'dept_uuid', '부서UUID')),
		body('*.grade_uuid','직급UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'grade_uuid', '직급UUID')),
		body('*.birthday','생년월일').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'birthday', '생년월일')),
		body('*.addr','주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr', '주소')),
		body('*.addr_detail','상세주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr_detail', '상세주소')),
		body('*.post','우편번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'post', '우편번호')),
		body('*.hp','전화번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'hp', '전화번호')),
		body('*.enter_date','입사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'enter_date', '입사일자')),
		body('*.leave_date','퇴사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'leave_date', '퇴사일자')),
		body('*.worker_fg','작업자유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'worker_fg', '작업자유무')),
		body('*.remark','비고').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'remark', '비고')),
  ],
  patch: [
    body('*.uuid', '사원UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '사원UUID'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '사원UUID')),
		body('*.emp_cd', '사원코드').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_cd', '사원코드')),
    body('*.emp_nm', '사원명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_nm', '사원명')),
		body('*.user_uuid', '사용자UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'user_uuid', '사용자UUID')),
		body('*.dept_uuid', '부서UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'dept_uuid', '부서UUID')),
		body('*.grade_uuid','직급UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'grade_uuid', '직급UUID')),
		body('*.birthday','생년월일').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'birthday', '생년월일')),
		body('*.addr','주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr', '주소')),
		body('*.addr_detail','상세주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr_detail', '상세주소')),
		body('*.post','우편번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'post', '우편번호')),
		body('*.hp','전화번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'hp', '전화번호')),
		body('*.enter_date','입사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'enter_date', '입사일자')),
		body('*.leave_date','퇴사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'leave_date', '퇴사일자')),
		body('*.worker_fg','작업자유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'worker_fg', '작업자유무')),
		body('*.remark','비고').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'remark', '비고')),
  ],
  delete: [
    body('*.uuid', '사원UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '사원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '사원UUID'))
  ],
};

export default stdEmpValidation;