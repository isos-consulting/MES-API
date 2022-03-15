import { body, param, query } from 'express-validator';
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
		body('*.remark','비고').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'remark', '비고')),
	],
	read: [
		query('emp_status', '재직유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_status', '재직유무'))
			.isIn([ 'all', 'incumbent', 'retiree' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_status', '재직유무'))
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
		body('*.remark','비고').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'remark', '비고')),
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