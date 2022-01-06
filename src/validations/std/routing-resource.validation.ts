import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdRoutingResource';

const stdRoutingResourceValidation = {
  read: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('routing_uuid', '라우팅UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'routing_uuid', '라우팅UUID')),
    query('resource_type', '자원유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'resource_type', '자원유형'))
      .isIn([ 'all', 'equip', 'mold', 'emp' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'resource_type', '자원유형')),
  ],
  readByUuid: [ 
    param('uuid', '생산자원UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '생산자원UUID'))
  ],
  create: [
    body('*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('*.routing_uuid', '라우팅UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'routing_uuid', '라우팅UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'routing_uuid', '라우팅UUID')),
    body('*.resource_type', '자원유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'resource_type', '자원유형'))
      .isIn([ '설비', '금형', '인원' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'resource_type', '자원유형')),
    body('*.equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.mold_uuid', '금형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_uuid', '금형UUID')),
    body('*.emp_cnt', '인원').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'emp_cnt', '인원')),
    body('*.cycle_time', 'Cycle Time')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'cycle_time', 'Cycle Time'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_time', 'Cycle Time')),
    body('*.uph', 'UPH').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uph', 'UPH')),
  ],
  update: [
    body('*.uuid', '생산자원UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '생산자원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '생산자원UUID')),
    body('*.resource_type', '자원유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'resource_type', '자원유형'))
      .isIn([ '설비', '금형', '인원' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'resource_type', '자원유형')),
    body('*.equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.mold_uuid', '금형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_uuid', '금형UUID')),
    body('*.emp_cnt', '인원').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'emp_cnt', '인원')),
    body('*.cycle_time', 'Cycle Time')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'cycle_time', 'Cycle Time'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_time', 'Cycle Time')),
    body('*.uph', 'UPH').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uph', 'UPH')),
  ],
  patch: [
    body('*.uuid', '생산자원UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '생산자원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '생산자원UUID')),
    body('*.resource_type', '자원유형').optional({ nullable: true })
      .isIn([ '설비', '금형', '인원' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'resource_type', '자원유형')),
    body('*.equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.mold_uuid', '금형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mold_uuid', '금형UUID')),
    body('*.emp_cnt', '인원').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'emp_cnt', '인원')),
    body('*.cycle_time', 'Cycle Time').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_time', 'Cycle Time')),
    body('*.uph', 'UPH').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uph', 'UPH')),
  ],
  delete: [
    body('*.uuid', '생산자원UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '생산자원UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '생산자원UUID'))
  ],
};

export default stdRoutingResourceValidation;