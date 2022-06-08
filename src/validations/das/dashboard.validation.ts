import { query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'dashboard';

const dashboardValidation = {
  readOverallStatus: [
    query('reg_date', '조회일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '조회일시'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'reg_date', '조회일시')),
  ],

  readRealtimeStatus: [
    query('reg_date', '조회일시')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'reg_date', '조회일시'))
      .isDate().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'reg_date', '조회일시')),
  ],
};

export default dashboardValidation;