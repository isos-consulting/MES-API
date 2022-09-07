import { param, query, body } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'prdWorkRouting';

const prdWorkRoutingValidation = {
  read: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('work_uuid', '실적UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'work_uuid', '실적UUID')),
    query('work_routing_origin_uuid', '공정순서기준UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'work_routing_origin_uuid', '공정순서기준UUID')),
    query('complete_fg', '완료여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'complete_fg', '완료여부'))
  ],
  readByUuid: [
    param('uuid', '공정순서UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '공정순서UUID'))
  ],

	/**
	 * @todo proc_uuid, proc_no -> work_routing_origin_uuid에 엮여 있으므로 추후에 빼야함
	 */
  create: [
    body('*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
		body('*.work_routing_origin_uuid', '실적 공정순서 기준UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_routing_origin_uuid', '실적 공정순서 기준UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_routing_origin_uuid', '실적 공정순서 기준UUID')),
    body('*.work_uuid', '실적UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_uuid', '실적UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_uuid', '실적UUID')),
    body('*.proc_uuid', '공정UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'proc_uuid', '공정UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'proc_uuid', '공정UUID')),
    body('*.proc_no', '공정순서')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'proc_no', '공정순서'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'proc_no', '공정순서')),
    body('*.workings_uuid', '작업장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'workings_uuid', '작업장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'workings_uuid', '작업장UUID')),
    body('*.equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.mold_uuid', '금형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_uuid', '금형UUID')),
    body('*.mold_cavity', '금형Cavity').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_cavity', '금형Cavity')),
    body('*.qty', '생산수량').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '생산수량')),
    body('*.start_date', '시작일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '시작일시')),
    body('*.end_date', '종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '종료일시')),
    body('*.ongoing_fg', '생산중인 공정 여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'ongoing_fg', '생산중인 공정 여부')),
    body('*.prd_signal_cnt', '생산카운트 신호 수').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_signal_cnt', '생산카운트 신호 수')),
    body('*.start_signal_val', '생산카운트 시작 값').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_signal_val', '생산카운트 시작 값')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  update: [
    body('*.uuid', '공정순서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '공정순서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '공정순서UUID')),
    body('*.workings_uuid', '작업장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'workings_uuid', '작업장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'workings_uuid', '작업장UUID')),
    body('*.work_routing_origin_uuid', '공정순서기준UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_routing_origin_uuid', '공정순서기준UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_routing_origin_uuid', '공정순서기준UUID')),
    body('*.equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.mold_uuid', '금형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_uuid', '금형UUID')),
    body('*.mold_cavity', '금형Cavity').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_cavity', '금형Cavity')),
    body('*.qty', '생산수량').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '생산수량')),
    body('*.start_date', '시작일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '시작일시')),
    body('*.end_date', '종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '종료일시')),
    body('*.ongoing_fg', '생산중인 공정 여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'ongoing_fg', '생산중인 공정 여부')),
    body('*.prd_signal_cnt', '생산카운트 신호 수').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_signal_cnt', '생산카운트 신호 수')),
    body('*.start_signal_val', '생산카운트 시작 값').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_signal_val', '생산카운트 시작 값')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  patch: [
    body('*.uuid', '공정순서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '공정순서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '공정순서UUID')),
    body('*.workings_uuid', '작업장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'workings_uuid', '작업장UUID')),
    body('*.work_routing_origin_uuid', '공정순서기준UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_routing_origin_uuid', '공정순서기준UUID')),
    body('*.equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.mold_uuid', '금형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_uuid', '금형UUID')),
    body('*.mold_cavity', '금형Cavity').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_cavity', '금형Cavity')),
    body('*.qty', '생산수량').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '생산수량')),
    body('*.start_date', '시작일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '시작일시')),
    body('*.end_date', '종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '종료일시')),
    body('*.ongoing_fg', '생산중인 공정 여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'ongoing_fg', '생산중인 공정 여부')),
    body('*.prd_signal_cnt', '생산카운트 신호 수').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_signal_cnt', '생산카운트 신호 수')),
    body('*.start_signal_val', '생산카운트 시작 값').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_signal_val', '생산카운트 시작 값')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  delete: [
    body('*.uuid', '공정순서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '공정순서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '공정순서UUID'))
  ],
	updateComplete: [
    body('*.uuid', '공정순서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '공정순서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '공정순서UUID')),
		body('*.work_uuid', '실적UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_uuid', '실적UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'work_uuid', '실적UUID')),
    body('*.workings_uuid', '작업장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'workings_uuid', '작업장UUID')),
    body('*.equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.mold_uuid', '금형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_uuid', '금형UUID')),
    body('*.mold_cavity', '금형Cavity').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_cavity', '금형Cavity')),
    body('*.qty', '생산수량').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '생산수량')),
    body('*.start_date', '시작일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '시작일시')),
    body('*.end_date', '종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '종료일시')),
    body('*.ongoing_fg', '생산중인 공정 여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'ongoing_fg', '생산중인 공정 여부')),
    body('*.prd_signal_cnt', '생산카운트 신호 수').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_signal_cnt', '생산카운트 신호 수')),
    body('*.start_signal_val', '생산카운트 시작 값').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_signal_val', '생산카운트 시작 값')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
};

export default prdWorkRoutingValidation;