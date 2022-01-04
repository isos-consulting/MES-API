import { param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'eqmInspDetail';

const eqmInspDetailValidation = {
  read: [
    query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
    query('insp_uuid', '설비검사기준서UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'insp_uuid', '설비검사기준서UUID')),
    query('insp_type', '기준서유형')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'insp_type', '기준서유형'))
      .isIn([ 'all', 'daily', 'periodicity' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'insp_type', '기준서유형'))
  ],
  readByUuid: [
    param('uuid', '설비검사기준서상세UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '설비검사기준서상세UUID'))
  ]
};

export default eqmInspDetailValidation;