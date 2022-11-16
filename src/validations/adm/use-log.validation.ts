import { body } from "express-validator";
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'admUseLog';

const admUseLogValidation = {
  create: [
		body('*.log_info', 'log 정보')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'log_info', 'log 정보'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'log_info', 'log 정보')),
		body('*.log_tag', 'log tag')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'log_tag', 'log tag'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'log_tag', 'log tag')),
		body('*.log_caption', 'log caption')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'log_caption', 'log caption'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'log_caption', 'log caption')),
		body('*.log_action', 'log action')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'log_action', 'log action'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'log_action', 'log action')),
  ],
}

export default admUseLogValidation;