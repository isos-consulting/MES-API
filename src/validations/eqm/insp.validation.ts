import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'eqmInsp';

const mldMoldValidation = {
  read: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'equip_uuid', '설비UUID')),
    query('apply_fg', '기준서 적용여부').optional({ nullable: true })
      .isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'apply_fg', '기준서 적용여부'))
  ],
  readByUuid: [
    param('uuid', '설비검사기준서UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '설비검사기준서UUID'))
  ],
  readDetails: [
    param('uuid', '설비검사기준서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비검사기준서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '설비검사기준서UUID')),
    query('insp_type', '기준서유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_type', '기준서유형'))
      .isIn([ 'all, daily, periodicity' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'insp_type', '기준서유형'))
  ],
  readIncludeDetails: [
    param('uuid', '설비검사기준서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비검사기준서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '설비검사기준서UUID')),
    query('insp_type', '기준서유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_type', '기준서유형'))
      .isIn([ 'all, daily, periodicity' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'insp_type', '기준서유형'))
  ],
  create: [
    body('header.uuid', '설비검사기준서UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비검사기준서UUID')),
    body('header.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('header.insp_no', '기준서번호').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_no', '기준서번호')),
    body('header.equip_uuid', '설비UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'equip_uuid', '설비UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('header.reg_date', '기준서 등록일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '기준서 등록일시'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '기준서 등록일시')),
    body('header.contents', '개정내역').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'contents', '개정내역')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

    body('details.*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('details.*.insp_item_uuid', '검사항목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_item_uuid', '검사항목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_item_uuid', '검사항목UUID')),
    body('details.*.insp_item_desc', '검사항목 상세내용').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_item_desc', '검사항목 상세내용')),
    body('details.*.spec_std', '검사 기준')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'spec_std', '검사 기준'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'spec_std', '검사 기준')),
    body('details.*.spec_min', '최소 값').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'spec_min', '최소 값')),
    body('details.*.spec_max', '최대 값').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'spec_max', '최대 값')),
    body('details.*.insp_tool_uuid', '검사구UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_tool_uuid', '검사구UUID')),
    body('details.*.insp_method_uuid', '검사방법UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_method_uuid', '검사방법UUID')),
    body('details.*.base_date', '주기 기준일').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'base_date', '주기 기준일')),
    body('details.*.daily_insp_cycle_uuid', '일상점검주기UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'daily_insp_cycle_uuid', '일상점검주기UUID')),
    body('details.*.cycle_unit_uuid', '주기단위UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_unit_uuid', '주기단위UUID')),
    body('details.*.cycle', '점검주기').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle', '점검주기')),
    body('details.*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  updateApply: [
    body('*.uuid', '설비검사기준서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비검사기준서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비검사기준서UUID'))
  ],
  updateCancelApply: [
    body('*.uuid', '설비검사기준서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비검사기준서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비검사기준서UUID'))
  ],
  update: [
    body('header.uuid', '설비검사기준서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비검사기준서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비검사기준서UUID')),
    body('header.insp_no', '기준서번호').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_no', '기준서번호')),
    body('header.reg_date', '기준서 등록일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '기준서 등록일시'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '기준서 등록일시')),
    body('header.contents', '개정내역').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'contents', '개정내역')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

    body('details.*.uuid', '설비검사기준서상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비검사기준서상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비검사기준서상세UUID')),
    body('details.*.insp_item_desc', '검사항목 상세내용').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_item_desc', '검사항목 상세내용')),
    body('details.*.spec_std', '검사 기준')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'spec_std', '검사 기준'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'spec_std', '검사 기준')),
    body('details.*.spec_min', '최소 값').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'spec_min', '최소 값')),
    body('details.*.spec_max', '최대 값').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'spec_max', '최대 값')),
    body('details.*.insp_tool_uuid', '검사구UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_tool_uuid', '검사구UUID')),
    body('details.*.insp_method_uuid', '검사방법UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_method_uuid', '검사방법UUID')),
    body('details.*.base_date', '주기 기준일').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'base_date', '주기 기준일')),
    body('details.*.daily_insp_cycle_uuid', '일상점검주기UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'daily_insp_cycle_uuid', '일상점검주기UUID')),
    body('details.*.cycle_unit_uuid', '주기단위UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_unit_uuid', '주기단위UUID')),
    body('details.*.cycle', '점검주기').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle', '점검주기')),
    body('details.*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  patch: [
    body('header.uuid', '설비검사기준서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비검사기준서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비검사기준서UUID')),
    body('header.insp_no', '기준서번호').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_no', '기준서번호')),
    body('header.reg_date', '기준서 등록일시').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'reg_date', '기준서 등록일시')),
    body('header.contents', '개정내역').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'contents', '개정내역')),
    body('header.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),

    body('details.*.uuid', '설비검사기준서상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비검사기준서상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비검사기준서상세UUID')),
    body('details.*.insp_item_desc', '검사항목 상세내용').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_item_desc', '검사항목 상세내용')),
    body('details.*.spec_std', '검사 기준').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'spec_std', '검사 기준')),
    body('details.*.spec_min', '최소 값').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'spec_min', '최소 값')),
    body('details.*.spec_max', '최대 값').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'spec_max', '최대 값')),
    body('details.*.insp_tool_uuid', '검사구UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_tool_uuid', '검사구UUID')),
    body('details.*.insp_method_uuid', '검사방법UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'insp_method_uuid', '검사방법UUID')),
    body('details.*.base_date', '주기 기준일').optional({ nullable: true })
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'base_date', '주기 기준일')),
    body('details.*.daily_insp_cycle_uuid', '일상점검주기UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'daily_insp_cycle_uuid', '일상점검주기UUID')),
    body('details.*.cycle_unit_uuid', '주기단위UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle_unit_uuid', '주기단위UUID')),
    body('details.*.cycle', '점검주기').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'cycle', '점검주기')),
    body('details.*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬')),
    body('details.*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고'))
  ],
  delete: [
    body('header.uuid', '설비검사기준서UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비검사기준서UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비검사기준서UUID')),

    body('details.*.uuid', '설비검사기준서상세UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비검사기준서상세UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비검사기준서상세UUID')),
  ]
};

export default mldMoldValidation;