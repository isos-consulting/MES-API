import { body, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdBom';

const stdBomValidation = {
  read: [
		query('factory_uuid', '공장UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
		query('p_prod_uuid', '부모품목UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'p_prod_uuid', '부모품목UUID')),
	],
   readByUuid: [ 
      param('uuid', 'BOM UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', 'BOM UUID'))
   ],
   readToTrees: [
       query('factory_uuid', '공장UUID').optional({ nullable: true })
       .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_uuid', '공장UUID')),
       query('prod_uuid', '품목UUID').optional({ nullable: true })
       .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prod_uuid', '품목UUID')),
    ],
  create: [
    body('*.factory_uuid', '공장UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_uuid', '공장UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'factory_uuid', '공장UUID')),
    body('*.p_prod_uuid', '부모품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'p_prod_uuid', '부모품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'p_prod_uuid', '부모품목UUID')),
    body('*.c_prod_uuid', '자식품목UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'c_prod_uuid', '자식품목UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'c_prod_uuid', '자식품목UUID')),  
   body('*.c_usage', '소요량')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'c_prod_uuid', '자식품목UUID'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'c_prod_uuid', '자식품목UUID')),  
   body('*.unit_uuid', '단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'unit_uuid', '단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'unit_uuid', '단위UUID')),  
   body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬')),  
   body('*.from_store_uuid', '출고 창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'from_store_uuid', '출고창고UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_store_uuid', '출고창고UUID')),
   body('*.from_location_uuid', '출고 위치UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_location_uuid', '출고위치UUID')),
   body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),  
		],
  update: [
    body('*.uuid', 'BOM UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', 'BOM UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', 'BOM UUID')),
		body('*.c_usage', '소요량')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'c_prod_uuid', '자식품목UUID'))
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'c_prod_uuid', '자식품목UUID')),  
    body('*.unit_uuid', '단위UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'unit_uuid', '단위UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'unit_uuid', '단위UUID')),
		body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬')),  
    body('*.from_store_uuid', '출고창고UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'from_store_uuid', '출고창고UUID'))
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_store_uuid', '출고창고UUID')),
		body('*.from_location_uuid', '출고위치UUID').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_location_uuid', '출고위치UUID')),
		body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),  
  ],
  patch: [
    body('*.uuid', 'BOM UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', 'BOM UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', 'BOM UUID')),
		body('*.c_usage', '소요량').optional({ nullable: true })
      .isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'c_prod_uuid', '자식품목UUID')),  
    body('*.unit_uuid', '단위UUID').optional({ nullable: true })
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'unit_uuid', '단위UUID')),
		body('*.sortby', '정렬').optional({ nullable: true })
      .isInt().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sortby', '정렬')),  
    body('*.from_store_uuid', '출고창고UUID').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_store_uuid', '출고창고UUID')),
		body('*.from_location_uuid', '출고창고UUID').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'from_location_uuid', '출고위치UUID')),
		body('*.remark', '비고').optional({ nullable: true })
      .isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'remark', '비고')),  
  ],
  delete: [
    body('*.uuid', 'BOM UUID')
      .notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', 'BOM UUID'))
      .isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', 'BOM UUID'))
  ],
};

export default stdBomValidation;