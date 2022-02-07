import { param, query, body } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'prdOrderInput';

const prdOrderInputValidation = {
  read: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('order_uuid', '지시UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'order_uuid', '지시UUID')),
  ],
  readByUuid: [
    param('uuid', '자재투입UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '자재투입UUID'))
  ],
  create: [
    body('*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('*.order_uuid', '지시UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'order_uuid', '지시UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'order_uuid', '지시UUID')),
    body('*.prod_uuid', '품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_uuid', '품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
    body('*.c_usage', '소요량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'c_usage', '소요량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'c_usage', '소요량')),
    body('*.unit_uuid', '단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'unit_uuid', '단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'unit_uuid', '단위UUID')),
    body('*.bom_input_type_uuid', '투입방법UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'bom_input_type_uuid', '투입방법UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_input_type_uuid', '투입방법UUID')),
    body('*.from_store_uuid', '출고창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'from_store_uuid', '출고창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_store_uuid', '출고창고UUID')),
    body('*.from_location_uuid', '출고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_location_uuid', '출고위치UUID')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  update: [
    body('*.uuid', '자재투입UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '자재투입UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '자재투입UUID')),
    body('*.c_usage', '소요량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'c_usage', '소요량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'c_usage', '소요량')),
    body('*.unit_uuid', '단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'unit_uuid', '단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'unit_uuid', '단위UUID')),
    body('*.bom_input_type_uuid', '투입방법UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'bom_input_type_uuid', '투입방법UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_input_type_uuid', '투입방법UUID')),
    body('*.from_store_uuid', '출고창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'from_store_uuid', '출고창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_store_uuid', '출고창고UUID')),
    body('*.from_location_uuid', '출고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_location_uuid', '출고위치UUID')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  patch: [
    body('*.uuid', '자재투입UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '자재투입UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '자재투입UUID')),
    body('*.c_usage', '소요량').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'c_usage', '소요량')),
    body('*.unit_uuid', '단위UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'unit_uuid', '단위UUID')),
    body('*.bom_input_type_uuid', '투입방법UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_input_type_uuid', '투입방법UUID')),
    body('*.from_store_uuid', '출고창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_store_uuid', '출고창고UUID')),
    body('*.from_location_uuid', '출고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_location_uuid', '출고위치UUID')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  delete: [
    body('*.uuid', '자재투입UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '자재투입UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '자재투입UUID'))
  ],
};

export default prdOrderInputValidation;