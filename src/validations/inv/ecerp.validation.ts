import { param } from "express-validator";
import { errorState } from "../../states/common.state";
import createValidationError from "../../utils/createValidationError";

const stateTag = 'invMove';

const invEcerpValidation = {
  read: [
    
  ],
  readByUuid: [
    param('uuid', 'ECERP 내역 UUID')
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', 'ECERP 내역 UUID'))
  ],
  create: [
    
  ],
  update: [
    
  ],
  patch: [
    
  ],
  delete: [
    
  ]
};

export default invEcerpValidation;