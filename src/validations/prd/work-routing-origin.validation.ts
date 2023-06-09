import { param, query, body } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'prdWorkRoutingOrigin';

const prdWorkRoutingOriginValidation = {
  read: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('work_uuid', '실적UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'work_uuid', '실적UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'work_uuid', '실적UUID')),
  ],
  readByUuid: [
    param('uuid', '공정순서UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '공정순서UUID'))
  ],
  create: [
    body('*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
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
    body('*.prd_signal_cnt', '생산카운트 신호 수').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_signal_cnt', '생산카운트 신호 수')),
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
    body('*.equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.mold_uuid', '금형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_uuid', '금형UUID')),
    body('*.mold_cavity', '금형Cavity').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_cavity', '금형Cavity')),
    body('*.prd_signal_cnt', '생산카운트 신호 수').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_signal_cnt', '생산카운트 신호 수')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  patch: [
    body('*.uuid', '공정순서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '공정순서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '공정순서UUID')),
    body('*.workings_uuid', '작업장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'workings_uuid', '작업장UUID')),
    body('*.equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.mold_uuid', '금형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_uuid', '금형UUID')),
    body('*.mold_cavity', '금형Cavity').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_cavity', '금형Cavity')),
    body('*.prd_signal_cnt', '생산카운트 신호 수').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_signal_cnt', '생산카운트 신호 수')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  delete: [
    body('*.uuid', '공정순서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '공정순서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '공정순서UUID'))
  ],
};

export default prdWorkRoutingOriginValidation;