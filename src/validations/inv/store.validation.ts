import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'invStore';

const invStoreValidation = {
  readTotalHistory: [
    query('sotck_type', '조회유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sotck_type', '조회유형'))
      .isIn([ 'all', 'available', 'reject', 'return', 'outgo', 'finalInsp', 'outsourcing' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sotck_type', '조회유형')),
    query('grouped_type', '분류유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'grouped_type', '분류유형'))
      .isIn([ 'all', 'factory', 'store', 'lotNo', 'location' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'grouped_type', '분류유형')),
    query('start_date', '기준 시작일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '기준 시작일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '기준 시작일자')),
    query('end_date', '기준 종료일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'end_date', '기준 종료일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '기준 종료일자')),
    query('reject_fg', '부적합 조회여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_fg', '부적합 조회여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_fg', '부적합 조회여부')),
    query('factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    query('store_uuid', '창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_uuid', '창고UUID')),
  ],
  readIndividualHistory: [
    query('start_date', '기준 시작일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '기준 시작일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '기준 시작일자')),
    query('end_date', '기준 종료일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'end_date', '기준 종료일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '기준 종료일자')),
    query('factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    query('store_uuid', '창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'store_uuid', '창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_uuid', '창고UUID')),
  ],
  readTypeHistory: [
    query('grouped_type', '분류유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'grouped_type', '분류유형'))
      .isIn([ 'all', 'factory', 'store', 'lotNo', 'location' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'grouped_type', '분류유형')),
    query('start_date', '기준 시작일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '기준 시작일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '기준 시작일자')),
    query('end_date', '기준 종료일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'end_date', '기준 종료일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '기준 종료일자')),
    query('reject_fg', '부적합 조회여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reject_fg', '부적합 조회여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_fg', '부적합 조회여부')),
    query('factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    query('store_uuid', '창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_uuid', '창고UUID')),
  ],
  readStoreHistoryByTransaction: [
    query('tran_type_cd', '수불유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'tran_type_cd', '수불유형'))
      .isIn([ 'MAT_INCOME', 'MAT_RETURN', 'MAT_RELEASE', 'PRD_RETURN', 'PRD_OUTPUT', 'PRD_INPUT', 'PRD_REJECT', 'SAL_INCOME', 'SAL_RELEASE', 
              'SAL_OUTGO', 'SAL_RETURN', 'OUT_INCOME', 'OUT_INPUT', 'OUT_RELEASE', 'INVENTORY', 'INV_MOVE', 'INV_REJECT', 'QMS_RECEIVE_INSP_REJECT', 
              'QMS_FINAL_INSP_INCOME', 'QMS_FINAL_INSP_REJECT', 'QMS_REWORK', 'QMS_DISPOSAL', 'QMS_RETURN', 'QMS_DISASSEMBLE', 'QMS_DISASSEMBLE_INCOME', 
              'QMS_DISASSEMBLE_RETURN', 'ETC_INCOME', 'ETC_RELEASE' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tran_type_cd', '수불유형')),
    query('start_date', '기준 시작일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '기준 시작일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '기준 시작일자')),
    query('end_date', '기준 종료일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'end_date', '기준 종료일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '기준 종료일자')),
    query('factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    query('store_uuid', '창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_uuid', '창고UUID')),
    query('location_uuid', '위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'location_uuid', '위치UUID')),
  ],
  readReturnStock: [
    query('exclude_zero_fg', '0재고 조회여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'exclude_zero_fg', '0재고 조회여부')),
    query('exclude_minus_fg', '마이너스 재고 조회여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'exclude_minus_fg', '마이너스 재고 조회여부')),
    query('reg_date', '기준일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '기준일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '기준일자')),
    query('factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    query('partner_uuid', '거래처UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_uuid', '거래처UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_uuid', '거래처UUID')),
    query('store_uuid', '창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_uuid', '창고UUID')),
    query('location_uuid', '위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'location_uuid', '위치UUID')),
  ],
  readStock: [
    query('sotck_type', '조회유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sotck_type', '조회유형'))
      .isIn([ 'all', 'available', 'reject', 'return', 'outgo', 'finalInsp', 'outsourcing' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sotck_type', '조회유형')),
    query('grouped_type', '분류유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'grouped_type', '분류유형'))
      .isIn([ 'all', 'factory', 'store', 'lotNo', 'location' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'grouped_type', '분류유형')),
    query('price_type', '단가유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'price_type', '단가유형'))
      .isIn([ 'all', 'purchase', 'sales' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'price_type', '단가유형')),
    query('exclude_zero_fg', '0재고 조회여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'exclude_zero_fg', '0재고 조회여부')),
    query('exclude_minus_fg', '마이너스 재고 조회여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'exclude_minus_fg', '마이너스 재고 조회여부')),
    query('reg_date', '기준일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '기준일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '기준일자')),
    query('factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    query('partner_uuid', '거래처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_uuid', '거래처UUID')),
    query('store_uuid', '창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_uuid', '창고UUID')),
    query('location_uuid', '위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'location_uuid', '위치UUID')),
    query('prod_uuid', '품목UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
    query('reject_uuid', '부적합UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_uuid', '부적합UUID')),
    query('lot_no', 'LOT NO').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_no', 'LOT NO')),
  ],
  read: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    query('store_uuid', '창고UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_uuid', '창고UUID')),
    query('prod_uuid', '품목UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
    query('tran_type_cd', '수불유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'tran_type_cd', '수불유형'))
      .isIn([ 'MAT_INCOME', 'MAT_RETURN', 'MAT_RELEASE', 'PRD_RETURN', 'PRD_OUTPUT', 'PRD_INPUT', 'PRD_REJECT', 'SAL_INCOME', 'SAL_RELEASE', 
              'SAL_OUTGO', 'SAL_RETURN', 'OUT_INCOME', 'OUT_INPUT', 'OUT_RELEASE', 'INVENTORY', 'INV_MOVE', 'INV_REJECT', 'QMS_RECEIVE_INSP_REJECT', 
              'QMS_FINAL_INSP_INCOME', 'QMS_FINAL_INSP_REJECT', 'QMS_REWORK', 'QMS_DISPOSAL', 'QMS_RETURN', 'QMS_DISASSEMBLE', 'QMS_DISASSEMBLE_INCOME', 
              'QMS_DISASSEMBLE_RETURN', 'ETC_INCOME', 'ETC_RELEASE' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'tran_type_cd', '수불유형')),
    query('start_date', '기준 시작일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '기준 시작일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '기준 시작일자')),
    query('end_date', '기준 종료일자')
    .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'end_date', '기준 종료일자'))
    .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '기준 종료일자')),
  ],
  readByUuid: [
    param('uuid', '재고수불UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '재고수불UUID'))
  ],
  create: [
    body('*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('*.reg_date', '수불일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '수불일시'))
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '수불일시')),
    body('*.prod_uuid', '품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_uuid', '품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
    body('*.lot_no', 'LOT NO')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_no', 'LOT NO'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_no', 'LOT NO')),
    body('*.qty', '수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qty', '수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '수량')),
    body('*.store_uuid', '창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'store_uuid', '창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'store_uuid', '창고UUID')),
    body('*.location_uuid', '위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'location_uuid', '위치UUID')),
    body('*.reject_uuid', '부적합UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reject_uuid', '부적합UUID')),
    body('*.partner_uuid', '거래처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_uuid', '거래처UUID')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  update: [
    body('*.uuid', '재고수불UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '재고수불UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '재고수불UUID')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  patch: [
    body('*.uuid', '재고수불UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '재고수불UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '재고수불UUID')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  delete: [
    body('*.uuid', '재고수불UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '재고수불UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '재고수불UUID')),
  ]
};

export default invStoreValidation;