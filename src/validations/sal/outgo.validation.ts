import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'salOutgo';

const salOutgoValidation = {
  read: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('start_date', '기준 시작일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'start_date', '기준 시작일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'start_date', '기준 시작일자')),
    query('end_date', '기준 종료일자')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'end_date', '기준 종료일자'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'end_date', '기준 종료일자'))
  ],
  readByUuid: [
    param('uuid', '제품출하UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '제품출하UUID'))
  ],
  readDetails: [
    param('uuid', '제품출하UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '제품출하UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '제품출하UUID')),
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('partner_uuid', '거래처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_uuid', '거래처UUID')),
  ],
  readIncludeDetails: [
    param('uuid', '제품출하UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '제품출하UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '제품출하UUID')),
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('partner_uuid', '거래처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'partner_uuid', '거래처UUID')),
  ],
  readReport: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('sort_type', '정렬유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sort_type', '정렬유형'))
      .isIn([ 'partner', 'prod', 'date' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'sort_type', '정렬유형')),
    query('start_date', '기준 시작일자').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'start_date', '기준 시작일자')),
    query('end_date', '기준 종료일자').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'end_date', '기준 종료일자')),
  ],
  readLotTracking: [
    query('factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('prod_uuid', '품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_uuid', '품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prod_uuid', '품목UUID')),
    query('lot_no', 'LOT NO')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_no', 'LOT NO'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'lot_no', 'LOT NO')),
  ],
  create: [
    body('header.uuid', '제품출하UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '제품출하UUID')),
    body('header.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('header.partner_uuid', '거래처UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_uuid', '거래처UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_uuid', '거래처UUID')),
    body('header.delivery_uuid', '납품처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'delivery_uuid', '납품처UUID')),
    body('header.stmt_no', '전표번호').optional({ nullable: true })
        .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'stmt_no', '전표번호')),
    body('header.reg_date', '등록일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '등록일시'))
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '등록일시')),
    body('header.order_uuid', '수주UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'order_uuid', '수주UUID')),
    body('header.outgo_order_uuid', '출하지시UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'outgo_order_uuid', '출하지시UUID')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

    body('details.*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('details.*.prod_uuid', '품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_uuid', '품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
    body('details.*.lot_no', 'LOT NO')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_no', 'LOT NO'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_no', 'LOT NO')),
    body('details.*.qty', '출하수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qty', '출하수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '출하수량')),
    body('details.*.price', '단가')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'price', '단가'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'price', '단가')),
    body('details.*.money_unit_uuid', '화폐단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_uuid', '화폐단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_uuid', '화폐단위UUID')),
    body('details.*.exchange', '환율')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'exchange', '환율'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'exchange', '환율')),
    body('details.*.unit_qty', '단위수량').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'unit_qty', '단위수량')),
    body('details.*.carry_fg', '이월여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'carry_fg', '이월여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'carry_fg', '이월여부')),
    body('details.*.order_detail_uuid', '수주상세UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'order_detail_uuid', '수주상세UUID')),
    body('details.*.outgo_order_detail_uuid', '출하지시상세UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'outgo_order_detail_uuid', '출하지시상세UUID')),
    body('details.*.from_store_uuid', '출고창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'from_store_uuid', '출고창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_store_uuid', '출고창고UUID')),
    body('details.*.from_location_uuid', '출고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_location_uuid', '출고위치UUID')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  createEcount: [
    body('*.uuid', '제품출하UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '제품출하UUID')),
    body('*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('*.partner_uuid', '거래처UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'partner_uuid', '거래처UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'partner_uuid', '거래처UUID')),
    body('*.delivery_uuid', '납품처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'delivery_uuid', '납품처UUID')),
    body('*.stmt_no', '전표번호').optional({ nullable: true })
        .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'stmt_no', '전표번호')),
    body('*.reg_date', '등록일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '등록일시'))
      .matches(RegExp(/^\d{4}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/)).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '등록일시')),
    body('*.order_uuid', '수주UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'order_uuid', '수주UUID')),
    body('*.outgo_order_uuid', '출하지시UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'outgo_order_uuid', '출하지시UUID')),
    body('*.prod_uuid', '품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_uuid', '품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_uuid', '품목UUID')),
    body('*.lot_no', 'LOT NO')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_no', 'LOT NO'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_no', 'LOT NO')),
    body('*.qty', '출하수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qty', '출하수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '출하수량')),
    body('*.price', '단가')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'price', '단가'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'price', '단가')),
    body('*.money_unit_uuid', '화폐단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_uuid', '화폐단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_uuid', '화폐단위UUID')),
    body('*.exchange', '환율')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'exchange', '환율'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'exchange', '환율')),
    body('*.unit_qty', '단위수량').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'unit_qty', '단위수량')),
    body('*.carry_fg', '이월여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'carry_fg', '이월여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'carry_fg', '이월여부')),
    body('*.order_detail_uuid', '수주상세UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'order_detail_uuid', '수주상세UUID')),
    body('*.outgo_order_detail_uuid', '출하지시상세UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'outgo_order_detail_uuid', '출하지시상세UUID')),
    body('*.from_store_uuid', '출고창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'from_store_uuid', '출고창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_store_uuid', '출고창고UUID')),
    body('*.from_location_uuid', '출고위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_location_uuid', '출고위치UUID')),
    body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  update: [
    body('header.uuid', '제품출하UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '제품출하UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '제품출하UUID')),
    body('header.delivery_uuid', '납품처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'delivery_uuid', '납품처UUID')),
    body('header.stmt_no', '전표번호').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'stmt_no', '전표번호')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

    body('details.*.uuid', '제품출하상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '제품출하상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '제품출하상세UUID')),
    body('details.*.qty', '출하수량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qty', '출하수량'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '출하수량')),
    body('details.*.price', '단가')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'price', '단가'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'price', '단가')),
    body('details.*.money_unit_uuid', '화폐단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'money_unit_uuid', '화폐단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_uuid', '화폐단위UUID')),
    body('details.*.exchange', '환율')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'exchange', '환율'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'exchange', '환율')),
    body('details.*.carry_fg', '이월여부')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'carry_fg', '이월여부'))
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'carry_fg', '이월여부')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  patch: [
    body('header.uuid', '제품출하UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '제품출하UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '제품출하UUID')),
    body('header.delivery_uuid', '납품처UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'delivery_uuid', '납품처UUID')),
    body('header.stmt_no', '전표번호').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'stmt_no', '전표번호')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

    body('details.*.uuid', '제품출하상세UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '제품출하상세UUID')),
    body('details.*.qty', '출하수량').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qty', '출하수량')),
    body('details.*.price', '단가').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'price', '단가')),
    body('details.*.money_unit_uuid', '화폐단위UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'money_unit_uuid', '화폐단위UUID')),
    body('details.*.exchange', '환율').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'exchange', '환율')),
    body('details.*.carry_fg', '이월여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'carry_fg', '이월여부')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),
  ],
  delete: [
    body('header.uuid', '제품출하UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '제품출하UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '제품출하UUID')),

    body('details.*.uuid', '제품출하상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '제품출하상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '제품출하상세UUID')),
  ]
};

export default salOutgoValidation;