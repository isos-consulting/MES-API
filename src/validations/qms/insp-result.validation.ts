import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'qmsInspResult';

const qmsInspResultValidation = {
  readMaxSeqInProcInsp: [
    query('work_uuid', '실적UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_uuid', '실적UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'work_uuid', '실적UUID')),
    query('insp_detail_type_uuid', '기준서상세 유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_detail_type_uuid', '기준서상세 유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'insp_detail_type_uuid', '기준서상세 유형UUID'))
  ],
  readProcDetailsByWork: [
    query('work_uuid', '실적UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_uuid', '실적UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'work_uuid', '실적UUID')),
    query('insp_detail_type_uuid', '기준서상세 유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_detail_type_uuid', '기준서상세 유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'insp_detail_type_uuid', '기준서상세 유형UUID'))
  ],
  readProcIncludeDetails: [
    param('uuid', '검사성적서UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '검사성적서UUID'))    
  ],
  readProc: [
    query('insp_detail_type_uuid', '기준서상세 유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'insp_detail_type_uuid', '기준서상세 유형UUID')),
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('work_uuid', '실적UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'work_uuid', '실적UUID')),
    query('start_date', '시작일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '시작일시')),
    query('end_date', '종료일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '종료일시')),
  ],
  createProcInsp: [
    body('header.uuid', '검사성적서UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서UUID')),
    body('header.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('header.work_uuid', '실적UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_uuid', '실적UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_uuid', '실적UUID')),
    body('header.insp_type_uuid', '검사유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_type_uuid', '검사유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_type_uuid', '검사유형UUID')),
    body('header.insp_detail_type_uuid', '세부검사유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_detail_type_uuid', '세부검사유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_detail_type_uuid', '세부검사유형UUID')),
    body('header.insp_uuid', '검사기준서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_uuid', '검사기준서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_uuid', '검사기준서UUID')),
    body('header.prod_uuid', '품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_uuid', '품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
    body('header.lot_no', 'LOT NO')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_no', 'LOT NO'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_no', 'LOT NO')),
    body('header.emp_uuid', '검사자 사원UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_uuid', '검사자 사원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'emp_uuid', '검사자 사원UUID')),
    body('header.reg_date', '성적서 등록일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '성적서 등록일시'))
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '성적서 등록일시')),
    body('header.insp_result_fg', '검사성적서 합격여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 합격여부')),
    body('header.insp_qty', '검사수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_qty', '검사수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_qty', '검사수량')),
    body('header.pass_qty', '합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'pass_qty', '합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pass_qty', '합격수량')),
    body('header.reject_qty', '불합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_qty', '불합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_qty', '불합격수량')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

		body('details.*.values', 'valuesArrayCheck').optional({ nullable: true })
			.isArray().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'values', 'valuesArrayCheck')),
    body('details.*.values.*.sample_no', '시료번호')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sample_no', '시료번호'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sample_no', '시료번호')),
    body('details.*.values.*.insp_result_fg', '검사성적서 상세 값 합격여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_result_fg', '검사성적서 상세 값 합격여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 값 합격여부')),
    body('details.*.values.*.insp_value', '검사결과 값')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_value', '검사결과 값'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_value', '검사결과 값')),

    body('details.*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('details.*.insp_detail_uuid', '검사기준서 상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_detail_uuid', '검사기준서 상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_detail_uuid', '검사기준서 상세UUID')),
    body('details.*.insp_result_fg', '검사성적서 상세 합격여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_result_fg', '검사성적서 상세 합격여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 합격여부')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  updateProcInsp: [
    body('header.uuid', '검사성적서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사성적서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서UUID')),
    body('header.emp_uuid', '검사자 사원UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_uuid', '검사자 사원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'emp_uuid', '검사자 사원UUID')),
    body('header.insp_result_fg', '검사성적서 합격여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 합격여부')),
    body('header.insp_qty', '검사수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_qty', '검사수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_qty', '검사수량')),
    body('header.pass_qty', '합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'pass_qty', '합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pass_qty', '합격수량')),
    body('header.reject_qty', '불합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_qty', '불합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_qty', '불합격수량')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

		body('details.*.values', 'valuesArrayCheck').optional({ nullable: true })
			.isArray().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'values', 'valuesArrayCheck')),
    body('details.*.values.*.uuid', '검사성적서 상세 값UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서 상세 값UUID')),
    body('details.*.values.*.delete_fg', '성적서 상세 값 삭제실행여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'delete_fg', '성적서 상세 값 삭제실행여부')),
    body('details.*.values.*.sample_no', '시료번호')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sample_no', '시료번호'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sample_no', '시료번호')),
    body('details.*.values.*.insp_result_fg', '검사성적서 상세 값 합격여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 값 합격여부')),
    body('details.*.values.*.insp_value', '검사결과 값').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_value', '검사결과 값')),
    body('details.*.uuid', '검사성적서 상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사성적서 상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서 상세UUID')),
    body('details.*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('details.*.insp_result_fg', '검사성적서 상세 합격여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_result_fg', '검사성적서 상세 합격여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 합격여부')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  deleteProcInsp: [
    body('*.uuid', '검사성적서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사성적서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서UUID')),
  ],

  readWaitingReceive: [
    query('insp_detail_type_uuid', '기준서상세 유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'insp_detail_type_uuid', '기준서상세 유형UUID')),
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('partner_uuid', '거래처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_uuid', '거래처UUID')),
    query('start_date', '시작일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '시작일시')),
    query('end_date', '종료일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '종료일시')),
  ],
  readReceive: [
    query('insp_detail_type_uuid', '기준서상세 유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'insp_detail_type_uuid', '기준서상세 유형UUID')),
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('receive_detail_uuid', '입하상세UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'receive_detail_uuid', '입하상세UUID')),
    query('start_date', '시작일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '시작일시')),
    query('end_date', '종료일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '종료일시')),
  ],
  readReceiveIncludeDetails: [
    param('uuid', '검사성적서UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '검사성적서UUID'))    
  ],
  createReceiveInsp: [
    body('header.uuid', '검사성적서UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서UUID')),
    body('header.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('header.receive_detail_uuid', '입하상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'receive_detail_uuid', '입하상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'receive_detail_uuid', '입하상세UUID')),
    body('header.insp_type_uuid', '검사유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_type_uuid', '검사유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_type_uuid', '검사유형UUID')),
    body('header.insp_detail_type_uuid', '세부검사유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_detail_type_uuid', '세부검사유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_detail_type_uuid', '세부검사유형UUID')),
    body('header.insp_handling_type_uuid', '검사처리유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_handling_type_uuid', '검사처리유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_handling_type_uuid', '검사처리유형UUID')),
    body('header.insp_uuid', '검사기준서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_uuid', '검사기준서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_uuid', '검사기준서UUID')),
    body('header.prod_uuid', '품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_uuid', '품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
    body('header.lot_no', 'LOT NO')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_no', 'LOT NO'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_no', 'LOT NO')),
    body('header.emp_uuid', '검사자 사원UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_uuid', '검사자 사원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'emp_uuid', '검사자 사원UUID')),
    body('header.reg_date', '성적서 등록일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '성적서 등록일시'))
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '성적서 등록일시')),
    body('header.insp_result_fg', '검사성적서 합격여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 합격여부')),
    body('header.insp_qty', '검사수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_qty', '검사수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_qty', '검사수량')),
    body('header.pass_qty', '합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'pass_qty', '합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pass_qty', '합격수량')),
    body('header.reject_qty', '불합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_qty', '불합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_qty', '불합격수량'))
			.custom((value , {req}) =>{
				if (value > 0 && req.body.header.reject_uuid === null ){
					throw createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_uuid', '부적합UUID')
				}
				if (value > 0 && req.body.header.reject_store_uuid === null ){
					throw createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_store_uuid', '부적합 입고창고UUID')
				}
				return true;
			}),
    body('header.reject_uuid', '부적합UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_uuid', '부적합UUID')),
    body('header.to_store_uuid', '입고창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'to_store_uuid', '입고창고UUID')),
    body('header.to_location_uuid', '입고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'to_location_uuid', '입고위치UUID')),
    body('header.reject_store_uuid', '부적합 입고창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_store_uuid', '부적합 입고창고UUID')),
    body('header.reject_location_uuid', '부적합 입고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_location_uuid', '부적합 입고위치UUID')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

		body('details.*.values', 'valuesArrayCheck').optional({ nullable: true })
			.isArray().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'values', 'valuesArrayCheck')),
    body('details.*.values.*.sample_no', '시료번호')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sample_no', '시료번호'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sample_no', '시료번호')),
    body('details.*.values.*.insp_result_fg', '검사성적서 상세 값 합격여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_result_fg', '검사성적서 상세 값 합격여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 값 합격여부')),
    body('details.*.values.*.insp_value', '검사결과 값')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_value', '검사결과 값'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_value', '검사결과 값')),
    body('details.*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('details.*.insp_detail_uuid', '검사기준서 상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_detail_uuid', '검사기준서 상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_detail_uuid', '검사기준서 상세UUID')),
    body('details.*.insp_result_fg', '검사성적서 상세 합격여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_result_fg', '검사성적서 상세 합격여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 합격여부')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  updateReceiveInsp: [
    body('header.uuid', '검사성적서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사성적서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서UUID')),
    body('header.insp_detail_type_uuid', '세부검사유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_detail_type_uuid', '세부검사유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_detail_type_uuid', '세부검사유형UUID')),
    body('header.insp_handling_type_uuid', '검사처리유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_handling_type_uuid', '검사처리유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_handling_type_uuid', '검사처리유형UUID')),
    body('header.emp_uuid', '검사자 사원UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_uuid', '검사자 사원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'emp_uuid', '검사자 사원UUID')),
		body('header.reg_date', '성적서 등록일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '성적서 등록일시'))
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '성적서 등록일시')),
    body('header.insp_result_fg', '검사성적서 합격여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 합격여부')),
    body('header.insp_qty', '검사수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_qty', '검사수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_qty', '검사수량')),
    body('header.pass_qty', '합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'pass_qty', '합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pass_qty', '합격수량')),
    body('header.reject_qty', '불합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_qty', '불합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_qty', '불합격수량'))
			.custom((value , {req}) =>{
				if (value > 0 && req.body.header.reject_uuid === null ){
					throw createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_uuid', '부적합UUID')
				}
				if (value > 0 && req.body.header.reject_store_uuid === null ){
					throw createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_store_uuid', '부적합 입고창고UUID')
				}
				return true;
			}),
    body('header.reject_uuid', '부적합UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_uuid', '부적합UUID')),
    body('header.to_store_uuid', '입고창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'to_store_uuid', '입고창고UUID')),
    body('header.to_location_uuid', '입고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'to_location_uuid', '입고위치UUID')),
    body('header.reject_store_uuid', '부적합 입고창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_store_uuid', '부적합 입고창고UUID')),
    body('header.reject_location_uuid', '부적합 입고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_location_uuid', '부적합 입고위치UUID')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

		body('details.*.values', 'valuesArrayCheck').optional({ nullable: true })
			.isArray().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'values', 'valuesArrayCheck')),
    body('details.*.values.*.uuid', '검사성적서 상세 값UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서 상세 값UUID')),
    body('details.*.values.*.delete_fg', '성적서 상세 값 삭제실행여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'delete_fg', '성적서 상세 값 삭제실행여부')),
    body('details.*.values.*.sample_no', '시료번호')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sample_no', '시료번호'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sample_no', '시료번호')),
    body('details.*.values.*.insp_result_fg', '검사성적서 상세 값 합격여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 값 합격여부')),
    body('details.*.values.*.insp_value', '검사결과 값').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_value', '검사결과 값')),
    body('details.*.uuid', '검사성적서 상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사성적서 상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서 상세UUID')),
    body('details.*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('details.*.insp_result_fg', '검사성적서 상세 합격여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_result_fg', '검사성적서 상세 합격여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 합격여부')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  deleteReceiveInsp: [
    body('*.uuid', '검사성적서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사성적서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서UUID')),
    body('*.insp_detail_type_uuid', '세부검사유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_detail_type_uuid', '세부검사유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_detail_type_uuid', '세부검사유형UUID')),
  ],

  readFinalIncludeDetails: [
    param('uuid', '검사성적서UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '검사성적서UUID'))    
  ],
  readFinal: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('start_date', '시작일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '시작일시')),
    query('end_date', '종료일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '종료일시')),
  ],
  createFinalInsp: [
    body('header.uuid', '검사성적서UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서UUID')),
    body('header.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('header.insp_type_uuid', '검사유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_type_uuid', '검사유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_type_uuid', '검사유형UUID')),
    body('header.insp_handling_type_uuid', '검사처리유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_handling_type_uuid', '검사처리유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_handling_type_uuid', '검사처리유형UUID')),
    body('header.insp_uuid', '검사기준서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_uuid', '검사기준서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_uuid', '검사기준서UUID')),
    body('header.prod_uuid', '품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_uuid', '품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
    body('header.lot_no', 'LOT NO')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_no', 'LOT NO'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_no', 'LOT NO')),
    body('header.emp_uuid', '검사자 사원UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_uuid', '검사자 사원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'emp_uuid', '검사자 사원UUID')),
    body('header.reg_date', '성적서 등록일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '성적서 등록일시'))
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '성적서 등록일시')),
    body('header.insp_result_fg', '검사성적서 합격여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 합격여부')),
    body('header.insp_qty', '검사수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_qty', '검사수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_qty', '검사수량')),
    body('header.pass_qty', '합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'pass_qty', '합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pass_qty', '합격수량')),
    body('header.reject_qty', '불합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_qty', '불합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_qty', '불합격수량'))
			.custom((value , {req}) =>{
				if (value > 0 && req.body.header.reject_uuid === null ){
					throw createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_uuid', '부적합UUID')
				}
				if (value > 0 && req.body.header.reject_store_uuid === null ){
					throw createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_store_uuid', '부적합 입고창고UUID')
				}
				return true;
			}),
    body('header.reject_uuid', '부적합UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_uuid', '부적합UUID')),
    body('header.from_store_uuid', '출고창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_qty', '불합격수량'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_store_uuid', '출고창고UUID')),
    body('header.from_location_uuid', '출고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_location_uuid', '출고위치UUID')),
    body('header.to_store_uuid', '입고창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'to_store_uuid', '입고창고UUID')),
    body('header.to_location_uuid', '입고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'to_location_uuid', '입고위치UUID')),
    body('header.reject_store_uuid', '부적합 입고창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_store_uuid', '부적합 입고창고UUID')),
    body('header.reject_location_uuid', '부적합 입고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_location_uuid', '부적합 입고위치UUID')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

		body('details.*.values', 'valuesArrayCheck').optional({ nullable: true })
			.isArray().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'values', 'valuesArrayCheck')),
    body('details.*.values.*.sample_no', '시료번호')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sample_no', '시료번호'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sample_no', '시료번호')),
    body('details.*.values.*.insp_result_fg', '검사성적서 상세 값 합격여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_result_fg', '검사성적서 상세 값 합격여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 값 합격여부')),
    body('details.*.values.*.insp_value', '검사결과 값')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_value', '검사결과 값'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_value', '검사결과 값')),
    body('details.*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('details.*.insp_detail_uuid', '검사기준서 상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_detail_uuid', '검사기준서 상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_detail_uuid', '검사기준서 상세UUID')),
    body('details.*.insp_result_fg', '검사성적서 상세 합격여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_result_fg', '검사성적서 상세 합격여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 합격여부')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  updateFinalInsp: [
    body('header.uuid', '검사성적서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사성적서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서UUID')),
    body('header.insp_handling_type_uuid', '검사처리유형UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_handling_type_uuid', '검사처리유형UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_handling_type_uuid', '검사처리유형UUID')),
    body('header.emp_uuid', '검사자 사원UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'emp_uuid', '검사자 사원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'emp_uuid', '검사자 사원UUID')),
    body('header.insp_result_fg', '검사성적서 합격여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 합격여부')),
    body('header.insp_qty', '검사수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_qty', '검사수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_qty', '검사수량')),
    body('header.pass_qty', '합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'pass_qty', '합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'pass_qty', '합격수량')),
    body('header.reject_qty', '불합격수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_qty', '불합격수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_qty', '불합격수량'))
			.custom((value , {req}) =>{
				if (value > 0 && req.body.header.reject_uuid === null ){
					throw createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_uuid', '부적합UUID')
				}
				if (value > 0 && req.body.header.reject_store_uuid === null ){
					throw createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_store_uuid', '부적합 입고창고UUID')
				}
				return true;
			}),
    body('header.reject_uuid', '부적합UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_uuid', '부적합UUID')),
    body('header.from_store_uuid', '출고창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_qty', '불합격수량'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_store_uuid', '출고창고UUID')),
    body('header.from_location_uuid', '출고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_location_uuid', '출고위치UUID')),
    body('header.to_store_uuid', '입고창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'to_store_uuid', '입고창고UUID')),
    body('header.to_location_uuid', '입고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'to_location_uuid', '입고위치UUID')),
    body('header.reject_store_uuid', '부적합 입고창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_store_uuid', '부적합 입고창고UUID')),
    body('header.reject_location_uuid', '부적합 입고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_location_uuid', '부적합 입고위치UUID')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

		body('details.*.values', 'valuesArrayCheck').optional({ nullable: true })
			.isArray().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'values', 'valuesArrayCheck')),
    body('details.*.values.*.uuid', '검사성적서 상세 값UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서 상세 값UUID')),
    body('details.*.values.*.delete_fg', '성적서 상세 값 삭제실행여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'delete_fg', '성적서 상세 값 삭제실행여부')),
    body('details.*.values.*.sample_no', '시료번호')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sample_no', '시료번호'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sample_no', '시료번호')),
    body('details.*.values.*.insp_result_fg', '검사성적서 상세 값 합격여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 값 합격여부')),
    body('details.*.values.*.insp_value', '검사결과 값').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_value', '검사결과 값')),
    body('details.*.uuid', '검사성적서 상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사성적서 상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서 상세UUID')),
    body('details.*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('details.*.insp_result_fg', '검사성적서 상세 합격여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_result_fg', '검사성적서 상세 합격여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_result_fg', '검사성적서 상세 합격여부')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  deleteFinalInsp: [
    body('*.uuid', '검사성적서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '검사성적서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '검사성적서UUID')),
  ],
};

export default qmsInspResultValidation;