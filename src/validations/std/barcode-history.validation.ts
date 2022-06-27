import { body, param } from "express-validator";
import { errorState } from "../../states/common.state";
import createValidationError from "../../utils/createValidationError";

const stateTag = 'stdBarcodeHistory';

const stdBarcodeHistoryValidation = {
  read: [

  ],
  readByUuid: [
    param('uuid', '바코드이력UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '바코드이력'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '바코드이력UUID')),
  ],
  create: [
    body('*.barcode', '바코드')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'barcode', '바코드'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'barcode', '바코드')),
    body('*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('*.prod_uuid', '품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_uuid', '품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
    body('*.lot_no', 'LOT')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_no', 'LOT'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_no', 'LOT')),
    body('*.qty', '수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qty', '수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '수량')),
    body('*.reg_date', '바코드 사용 일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '바코드 사용 일시'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '바코드 사용 일시')),
    body('*.tran_type_uuid', '수불유형UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tran_type_uuid', '수불 유형 UUID')),
    body('*.reference_uuid', '바코드 사용 관련 UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reference_uuid', '바코드 사용 관련 UUID')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  // update: [
  //   body('*.uuid', '바코드이력UUID')
  //     .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '바코드이력UUID'))
  //     .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '바코드이력UUID')),
  //   body('*.barcode', '바코드')
  //     .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'barcode', '바코드'))
  //     .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'barcode', '바코드')),
  //   body('*.factory_uuid', '공장UUID')
  //     .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
  //     .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
  //   body('*.prod_uuid', '품목UUID')
  //     .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_uuid', '품목UUID'))
  //     .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
  //   body('*.lot_no', 'LOT')
  //     .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_no', 'LOT'))
  //     .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_no', 'LOT')),
  //   body('*.qty', '수량')
  //     .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qty', '수량'))
  //     .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '수량')),
  //   body('*.reg_date', '바코드 사용 일시')
  //     .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '바코드 사용 일시'))
  //     .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '바코드 사용 일시')),
  //   body('*.tran_type_uuid', '수불유형UUID').optional({ nullable: true })
  //     .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tran_type_uuid', '수불 유형 UUID')),
  //   body('*.reference_uuid', '바코드 사용 관련 UUID').optional({ nullable: true })
  //     .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reference_uuid', '바코드 관련 정보 ID')),
  //   body('*.remark', '비고').optional({ nullable: true })
  //     .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  // ],
  // patch: [
  //   body('*.uuid', '바코드이력UUID')
  //     .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '바코드이력UUID'))
  //     .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '바코드이력UUID')),
  //   body('*.barcode', '바코드').optional({ nullable: true })
  //     .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'barcode', '바코드')),
  //   body('*.factory_uuid', '공장UUID').optional({ nullable: true })
  //     .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
  //   body('*.prod_uuid', '품목UUID').optional({ nullable: true })
  //     .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
  //   body('*.lot_no', 'LOT').optional({ nullable: true })
  //     .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_no', 'LOT')),
  //   body('*.qty', '수량').optional({ nullable: true })
  //     .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '수량')),
  //   body('*.reg_date', '바코드 사용 일시').optional({ nullable: true })
  //     .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '바코드 사용 일시')),
  //   body('*.tran_type_uuid', '수불유형UUID').optional({ nullable: true })
  //     .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tran_type_uuid', '수불 유형 UUID')),
  //   body('*.reference_uuid', '바코드 관련 정보 ID').optional({ nullable: true })
  //     .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reference_uuid', '바코드 관련 정보 ID')),
  //   body('*.remark', '비고').optional({ nullable: true })
  //     .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  // ],
  delete: [
    body('*.uuid', '바코드이력UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '바코드이력UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '바코드이력UUID')),
  ],
}

export default stdBarcodeHistoryValidation;