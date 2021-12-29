import { body, param } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'eqmRepairHistory';

const eqmRepairHistoryValidation = {
  read: [],
  readByUuid: [ 
    param('uuid', '설비수리이력UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '설비수리이력UUID'))
  ],
  create: [
    body('*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('*.equip_uuid', '설비UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'equip_uuid', '설비UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.occur_start_date', '발생시작일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'occur_start_date', '발생시작일시'))
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_start_date', '발생시작일시')),
    body('*.occur_end_date', '발생종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_end_date', '발생종료일시')),
    body('*.occur_emp_uuid', '발생확인자UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_emp_uuid', '발생확인자UUID')),
    body('*.occur_reason', '발생원인').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_reason', '발생원인')),
    body('*.occur_contents', '발생내용').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_contents', '발생내용')),
    body('*.repair_start_date', '수리시작일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_start_date', '수리시작일시')),
    body('*.repair_end_date', '수리종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_end_date', '수리종료일시')),
    body('*.repair_time', '수리시간').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_time', '수리시간')),
    body('*.repair_place', '수리장소').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_place', '수리장소')),
    body('*.repair_price', '수리금액').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_price', '수리금액')),
    body('*.check_date', '점검일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'check_date', '점검일시')),
    body('*.check_emp_uuid', '점검자UUID').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'check_emp_uuid', '점검자UUID')),
  ],
  update: [
    body('*.uuid', '설비수리이력UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비수리이력UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비수리이력UUID')),
    body('*.equip_uuid', '설비UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'equip_uuid', '설비UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.occur_start_date', '발생시작일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'occur_start_date', '발생시작일시'))
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_start_date', '발생시작일시')),
    body('*.occur_end_date', '발생종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_end_date', '발생종료일시')),
    body('*.occur_emp_uuid', '발생확인자UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_emp_uuid', '발생확인자UUID')),
    body('*.occur_reason', '발생원인').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_reason', '발생원인')),
    body('*.occur_contents', '발생내용').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_contents', '발생내용')),
    body('*.repair_start_date', '수리시작일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_start_date', '수리시작일시')),
    body('*.repair_end_date', '수리종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_end_date', '수리종료일시')),
    body('*.repair_time', '수리시간').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_time', '수리시간')),
    body('*.repair_place', '수리장소').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_place', '수리장소')),
    body('*.repair_price', '수리금액').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_price', '수리금액')),
    body('*.check_date', '점검일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'check_date', '점검일시')),
    body('*.check_emp_uuid', '점검자UUID').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'check_emp_uuid', '점검자UUID')),
  ],
  patch: [
    body('*.uuid', '설비수리이력UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비수리이력UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비수리이력UUID')),
    body('*.equip_uuid', '설비UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'equip_uuid', '설비UUID')),
    body('*.occur_start_date', '발생시작일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_start_date', '발생시작일시')),
    body('*.occur_end_date', '발생종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_end_date', '발생종료일시')),
    body('*.occur_emp_uuid', '발생확인자UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_emp_uuid', '발생확인자UUID')),
    body('*.occur_reason', '발생원인').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_reason', '발생원인')),
    body('*.occur_contents', '발생내용').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'occur_contents', '발생내용')),
    body('*.repair_start_date', '수리시작일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_start_date', '수리시작일시')),
    body('*.repair_end_date', '수리종료일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_end_date', '수리종료일시')),
    body('*.repair_time', '수리시간').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_time', '수리시간')),
    body('*.repair_place', '수리장소').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_place', '수리장소')),
    body('*.repair_price', '수리금액').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'repair_price', '수리금액')),
    body('*.check_date', '점검일시').optional({ nullable: true })
      .isISO8601().toDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'check_date', '점검일시')),
    body('*.check_emp_uuid', '점검자UUID').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'check_emp_uuid', '점검자UUID')),
  ],
  delete: [
    body('*.uuid', '설비수리이력UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '설비수리이력UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '설비수리이력UUID'))
  ],
};

export default eqmRepairHistoryValidation;