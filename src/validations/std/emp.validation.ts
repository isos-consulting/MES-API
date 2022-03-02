import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdEmp';

const stdEmpValidation = {
	upsertBulkDatasFromExcel: [
		query('uuid', '사원UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '사원UUID')),
		query('emp_cd', '사원코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_cd', '사원코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_cd', '사원코드')),
		query('emp_nm', '사원명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_nm', '사원명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_nm', '사원명')),
		query('id', '사용자 로그인ID').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'id', '사용자 로그인ID')),
		query('dept_cd', '부서코드').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'dept_cd', '부서코드')),
		query('grade_cd','직급코드').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'grade_cd', '직급코드')),
		query('birthday','생년월일').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'birthday', '생년월일')),
		query('addr','주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr', '주소')),
		query('addr_detail','상세주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr_detail', '상세주소')),
		query('post','우편번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'post', '우편번호')),
		query('hp','전화번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'hp', '전화번호')),
		query('enter_date','입사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'enter_date', '입사일자')),
		query('leave_date','퇴사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'leave_date', '퇴사일자')),
		query('remark','비고').optional({ nullable: true })
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
		query('emp_cd', '사원코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_cd', '사원코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_cd', '사원코드')),
		query('emp_nm', '사원명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_nm', '사원명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_nm', '사원명')),
		query('user_uuid', '사용자UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'user_uuid', '사용자UUID')),
		query('dept_uuid', '부서UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'dept_uuid', '부서UUID')),
		query('grade_uuid','직급UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'grade_uuid', '직급UUID')),
		query('birthday','생년월일').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'birthday', '생년월일')),
		query('addr','주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr', '주소')),
		query('addr_detail','상세주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr_detail', '상세주소')),
		query('post','우편번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'post', '우편번호')),
		query('hp','전화번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'hp', '전화번호')),
		query('enter_date','입사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'enter_date', '입사일자')),
		query('leave_date','퇴사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'leave_date', '퇴사일자')),
		query('remark','비고').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'remark', '비고')),
	],
  update: [
		query('uuid', '사원UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '사원UUID'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '사원UUID')),
		query('emp_cd', '사원코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_cd', '사원코드'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_cd', '사원코드')),
    query('emp_nm', '사원명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_nm', '사원명'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_nm', '사원명')),
		query('user_uuid', '사용자UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'user_uuid', '사용자UUID')),
		query('dept_uuid', '부서UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'dept_uuid', '부서UUID')),
		query('grade_uuid','직급UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'grade_uuid', '직급UUID')),
		query('birthday','생년월일').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'birthday', '생년월일')),
		query('addr','주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr', '주소')),
		query('addr_detail','상세주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr_detail', '상세주소')),
		query('post','우편번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'post', '우편번호')),
		query('hp','전화번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'hp', '전화번호')),
		query('enter_date','입사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'enter_date', '입사일자')),
		query('leave_date','퇴사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'leave_date', '퇴사일자')),
		query('remark','비고').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'remark', '비고')),
  ],
  patch: [
    query('uuid', '사원UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '사원UUID'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '사원UUID')),
		query('emp_cd', '사원코드').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_cd', '사원코드')),
    query('emp_nm', '사원명').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'emp_nm', '사원명')),
		query('user_uuid', '사용자UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'user_uuid', '사용자UUID')),
		query('dept_uuid', '부서UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'dept_uuid', '부서UUID')),
		query('grade_uuid','직급UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'grade_uuid', '직급UUID')),
		query('birthday','생년월일').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'birthday', '생년월일')),
		query('addr','주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr', '주소')),
		query('addr_detail','상세주소').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'addr_detail', '상세주소')),
		query('post','우편번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'post', '우편번호')),
		query('hp','전화번호').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'hp', '전화번호')),
		query('enter_date','입사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'enter_date', '입사일자')),
		query('leave_date','퇴사일자').optional({ nullable: true })
			.isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'leave_date', '퇴사일자')),
		query('remark','비고').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'remark', '비고')),
  ],
  delete: [
    body('*.uuid', '사원UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '사원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '사원UUID'))
  ],
};

export default stdEmpValidation;