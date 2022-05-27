import { body, check, param, query } from 'express-validator';
import { errorState } from '../../states/common.state';
import createValidationError from '../../utils/createValidationError';

const stateTag = 'stdProd';

const stdProdValidation = {
  upsertBulkDatasFromExcel: [
		body('*.factory_cd', '공장코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'factory_cd', '공장코드'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'factory_cd', '공장코드')),
		body('*.prod_no', '품번')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_no', '품번'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prod_no', '품번')),
		body('*.prod_nm', '품목명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_nm', '품목명'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prod_nm', '품목명')),
		body('*.item_type_cd', '품목 유형코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'item_type_cd', '품목 유형코드'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'item_type_cd', '품목 유형코드')),
		body('*.prod_type_cd', '제품 유형코드').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prod_type_cd', '제품 유형코드')),
		body('*.model_cd', '모델코드').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'model_cd', '모델코드')),
		body('*.unit_cd', '단위코드')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'unit_cd', '단위코드'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'unit_cd', '단위코드')),
		body('*.rev', '리비전').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'rev', '리비전')),
		body('*.prod_std', '규격').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prod_std', '규격')),
		body('*.lot_fg', 'LOT사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_fg', 'LOT사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'lot_fg', 'LOT사용유무')),
		body('*.use_fg', '사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'use_fg', '사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'use_fg', '사용유무')),
		body('*.active_fg', '품목활성상태')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'active_fg', '품목활성상태'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'active_fg', '품목활성상태')),
		body('*.active_fg', '품목활성상태')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'active_fg', '품목활성상태'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'active_fg', '품목활성상태')),
		body('*.bom_type_uuid', 'BOM유형 UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'bom_type_uuid', 'BOM유형 UUID')),
		body('*.width', '폭').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'width', '폭')),
		body('*.length', '길이').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'length', '길이')),
		body('*.height', '높이').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'height', '높이')),
		body('*.material', '재질').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'material', '재질')),
		body('*.color', '색상').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'color', '색상')),
		body('*.weight', '중량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'weight', '중량')),
		body('*.thickness', '두께').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'thickness', '두께')),
		body('*.mat_order_fg', '발주 사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'mat_order_fg', '발주 사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'mat_order_fg', '발주 사용유무')),
		body('*.mat_unit_cd', '구매단위코드').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'mat_unit_cd', '구매단위코드')),
		body('*.mat_order_min_qty', '발주 최소 단위수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'mat_order_min_qty', '발주 최소 단위수량')),
		body('*.mat_supply_days', '발주 소요일').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'mat_supply_days', '발주 소요일')),
		body('*.sal_order_fg', '수주 사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sal_order_fg', '수주 사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'sal_order_fg', '수주 사용유무')),
		body('*.inv_use_fg', '창고 사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'inv_use_fg', '창고 사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'inv_use_fg', '창고 사용유무')),
		body('*.inv_unit_qty', '단위수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'inv_unit_qty', '단위수량')),
		body('*.inv_safe_qty', '안전재고수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'inv_safe_qty', '안전재고수량')),
		body('*.inv_to_store_cd', '입고 창고코드').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'inv_to_store_cd', '입고 창고코드')),
		body('*.inv_to_location_cd', '입고 위치코드').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'inv_to_location_cd', '입고 위치코드')),
		body('*.qms_receive_insp_fg', '수입검사유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qms_receive_insp_fg', '수입검사유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'qms_receive_insp_fg', '수입검사유무')),
		body('*.qms_proc_insp_fg', '공정검사유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qms_proc_insp_fg', '공정검사유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'qms_proc_insp_fg', '공정검사유무')),
		body('*.qms_final_insp_fg', '최종검사유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qms_final_insp_fg', '최종검사유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'qms_final_insp_fg', '최종검사유무')),
		body('*.prd_active_fg', '생산품유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prd_active_fg', '생산품유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prd_active_fg', '생산품유무')),
		body('*.prd_plan_type_uuid', '계획유형UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prd_plan_type_uuid', '계획유형UUID')),
		body('*.prd_min', '최소값').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prd_min', '최소값')),
		body('*.prd_max', '최대값').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prd_max', '최대값')),

	],
	read: [
		query('use_fg', '품목사용여부').optional({ nullable: true })
			.isIn([ 'true', 'false' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'use_fg', '품목사용여부')),
		query('qms_receive_insp_fg', '수입검사여부').optional({ nullable: true })
			.isIn([ 'true', 'false' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'qms_receive_insp_fg', '수입검사여부')),
		query('qms_proc_insp_fg', '공정검사여부').optional({ nullable: true })
			.isIn([ 'true', 'false' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'qms_proc_insp_fg', '공정검사여부')),
		query('qms_final_insp_fg', '최종검사여부').optional({ nullable: true })
			.isIn([ 'true', 'false' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'qms_final_insp_fg', '최종검사여부')),
		query('prd_active_fg', '생산품여부').optional({ nullable: true })
			.isIn([ 'true', 'false' ]).withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'prd_active_fg', '생산품여부')),
	],	
  readByUuid: [ 
		param('uuid', '품목 유형UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '품목 유형UUID'))
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_READ_PARAM, 400, 'uuid', '품목 유형UUID'))
  ],
	create: [
		body('*.prod_no', '품번')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_no', '품번'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_no', '품번')),
		body('*.prod_nm', '품목명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_nm', '품목명'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_nm', '품목명')),
		body('*.item_type_uuid', '품목유형UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'item_type_uuid', '품목유형UUID'))
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'item_type_uuid', '품목유형UUID')),
		body('*.prod_type_uuid', '제품유형UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_type_uuid', '제품유형UUID')),
		body('*.model_uuid', '모델UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'model_uuid', '모델UUID')),
		body('*.unit_uuid', '단위UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'unit_uuid', '단위UUID'))
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'unit_uuid', '단위UUID')),
		body('*.rev', '리비전').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'rev', '리비전')),
		body('*.prod_std', '규격').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_std', '규격')),
		body('*.lot_fg', 'LOT 사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_fg', 'LOT 사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_fg', 'LOT 사용유무')),
		body('*.use_fg', '사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'use_fg', '사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'use_fg', '사용유무')),
		body('*.active_fg', '품목 활성 상태')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'active_fg', '품목 활성 상태'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'active_fg', '품목 활성 상태')),
		body('*.bom_type_uuid', 'BOM유형 UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_type_uuid', 'BOM유형 UUID')),
		body('*.width', '폭').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'width', '폭')),
		body('*.length', '길이').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'length', '길이')),
		body('*.height', '높이').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'height', '높이')),
		body('*.material', '재질').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'material', '재질')),
		body('*.color', '색상').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'color', '색상')),
		body('*.weight', '중량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'weight', '중량')),
		body('*.thickness', '두께').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'thickness', '두께')),
		body('*.mat_order_fg', '발주 사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'mat_order_fg', '발주 사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_order_fg', '발주 사용유무')),
		body('*.mat_unit_uuid', '구매단위UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_unit_uuid', '구매단위UUID')),
		body('*.mat_order_min_qty', '발주 최소 단위수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_order_min_qty', '발주 최소 단위수량')),
		body('*.mat_supply_days', '발주 소요일').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_supply_days', '발주 소요일')),
		body('*.sal_order_fg', '수주사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sal_order_fg', '수주사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sal_order_fg', '수주사용유무')),
		body('*.inv_use_fg', '창고 사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'inv_use_fg', '창고 사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_use_fg', '창고 사용유무')),
		body('*.inv_unit_qty', '단위수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_unit_qty', '단위수량')),
		body('*.inv_safe_qty', '안전 재고수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_safe_qty', '안전 재고수량')),
		body('*.inv_to_store_uuid', '입고창고UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_to_store_uuid', '입고창고UUID')),
		body('*.inv_to_location_uuid', '입고 위치UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_to_location_uuid', '입고 위치UUID')),
		body('*.qms_receive_insp_fg', '수입검사유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qms_receive_insp_fg', '수입검사유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qms_receive_insp_fg', '수입검사유무')),
		body('*.qms_proc_insp_fg', '공정검사유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qms_proc_insp_fg', '공정검사유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qms_proc_insp_fg', '공정검사유무')),
		body('*.qms_final_insp_fg', '최종검사유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qms_final_insp_fg', '최종검사유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qms_final_insp_fg', '최종검사유무')),
		body('*.prd_active_fg', '생산품유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prd_active_fg', '생산품유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_active_fg', '생산품유무')),
		body('*.prd_plan_type_uuid', '계획유형UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_plan_type_uuid', '계획유형UUID')),
		body('*.prd_min', '최소값').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_min', '최소값')),
		body('*.prd_max', '최대값').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_max', '최대값')),
		check('*.files').bail(),
		body('*.files', '파일정보').optional({ nullable: true })
			.isArray().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'files', 'files UUID 배열')),
		body('*.files.*.uuid', '파일상세유형 UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '파일UUID'))
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '파일UUID')),	
		body('*.files.*.file_mgmt_detail_type_uuid', '파일상세유형 UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_mgmt_detail_type_uuid', '파일상세유형 UUID'))
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_mgmt_detail_type_uuid', '파일상세유형 UUID')),
		body('*.files.*.file_nm', '파일명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_nm', '파일명'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_nm', '파일명')),
		body('*.files.*.file_extension', '파일확장자')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_extension', '파일확장자'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_extension', '파일확장자')),
		body('*.files.*.file_size', '파일용량')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'file_size', '파일용량'))
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'file_size', '파일용량')),
		body('*.files.*.remark', '파일상세유형 UUID').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'files', 'files UUID 배열'))
	],
  update: [
		body('*.uuid', '품목UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '품목UUID'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '품목UUID')),
		body('*.prod_no', '품번')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_no', '품번'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_no', '품번')),
		body('*.prod_nm', '품목명')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prod_nm', '품목명'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_nm', '품목명')),
		body('*.item_type_uuid', '품목유형UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'item_type_uuid', '품목유형UUID'))
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'item_type_uuid', '품목유형UUID')),
		body('*.prod_type_uuid', '제품유형UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_type_uuid', '제품유형UUID')),
		body('*.model_uuid', '모델UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'model_uuid', '모델UUID')),
		body('*.unit_uuid', '단위UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'unit_uuid', '단위UUID'))
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'unit_uuid', '단위UUID')),
		body('*.rev', '리비전').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'rev', '리비전')),
		body('*.prod_std', '규격').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_std', '규격')),
		body('*.lot_fg', 'LOT 사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'lot_fg', 'LOT 사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_fg', 'LOT 사용유무')),
		body('*.use_fg', '사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'use_fg', '사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'use_fg', '사용유무')),
		body('*.active_fg', '품목 활성 상태')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'active_fg', '품목 활성 상태'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'active_fg', '품목 활성 상태')),
		body('*.bom_type_uuid', 'BOM유형 UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_type_uuid', 'BOM유형 UUID')),
		body('*.width', '폭').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'width', '폭')),
		body('*.length', '길이').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'length', '길이')),
		body('*.height', '높이').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'height', '높이')),
		body('*.material', '재질').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'material', '재질')),
		body('*.color', '색상').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'color', '색상')),
		body('*.weight', '중량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'weight', '중량')),
		body('*.thickness', '두께').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'thickness', '두께')),
		body('*.mat_order_fg', '발주 사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'mat_order_fg', '발주 사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_order_fg', '발주 사용유무')),
		body('*.mat_unit_uuid', '구매단위UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_unit_uuid', '구매단위UUID')),
		body('*.mat_order_min_qty', '발주 최소 단위수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_order_min_qty', '발주 최소 단위수량')),
		body('*.mat_supply_days', '발주 소요일').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_supply_days', '발주 소요일')),
		body('*.sal_order_fg', '수주사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'sal_order_fg', '수주사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sal_order_fg', '수주사용유무')),
		body('*.inv_use_fg', '창고 사용유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'inv_use_fg', '창고 사용유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_use_fg', '창고 사용유무')),
		body('*.inv_unit_qty', '단위수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_unit_qty', '단위수량')),
		body('*.inv_safe_qty', '안전 재고수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_safe_qty', '안전 재고수량')),
		body('*.inv_to_store_uuid', '입고창고UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_to_store_uuid', '입고창고UUID')),
		body('*.inv_to_location_uuid', '입고 위치UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_to_location_uuid', '입고 위치UUID')),
		body('*.qms_receive_insp_fg', '수입검사유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qms_receive_insp_fg', '수입검사유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qms_receive_insp_fg', '수입검사유무')),
		body('*.qms_proc_insp_fg', '공정검사유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qms_proc_insp_fg', '공정검사유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qms_proc_insp_fg', '공정검사유무')),
		body('*.qms_final_insp_fg', '최종검사유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'qms_final_insp_fg', '최종검사유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qms_final_insp_fg', '최종검사유무')),
		body('*.prd_active_fg', '생산품유무')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'prd_active_fg', '생산품유무'))
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_active_fg', '생산품유무')),
		body('*.prd_plan_type_uuid', '계획유형UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_plan_type_uuid', '계획유형UUID')),
		body('*.prd_min', '최소값').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_min', '최소값')),
		body('*.prd_max', '최대값').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_max', '최대값')),
  ],
	patch: [
		body('*.uuid', '품목UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '품목UUID'))
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '품목UUID')),
		body('*.prod_no', '품번').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_no', '품번')),
		body('*.prod_nm', '품목명').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_nm', '품목명')),
		body('*.item_type_uuid', '품목유형UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'item_type_uuid', '품목유형UUID')),
		body('*.prod_type_uuid', '제품유형UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_type_uuid', '제품유형UUID')),
		body('*.model_uuid', '모델UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'model_uuid', '모델UUID')),
		body('*.unit_uuid', '단위UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'unit_uuid', '단위UUID')),
		body('*.rev', '리비전').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'rev', '리비전')),
		body('*.prod_std', '규격').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prod_std', '규격')),
		body('*.lot_fg', 'LOT 사용유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'lot_fg', 'LOT 사용유무')),
		body('*.use_fg', '사용유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'use_fg', '사용유무')),
		body('*.active_fg', '품목 활성 상태').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'active_fg', '품목 활성 상태')),
		body('*.bom_type_uuid', 'BOM유형 UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'bom_type_uuid', 'BOM유형 UUID')),
		body('*.width', '폭').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'width', '폭')),
		body('*.length', '길이').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'length', '길이')),
		body('*.height', '높이').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'height', '높이')),
		body('*.material', '재질').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'material', '재질')),
		body('*.color', '색상').optional({ nullable: true })
			.isString().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'color', '색상')),
		body('*.weight', '중량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'weight', '중량')),
		body('*.thickness', '두께').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'thickness', '두께')),
		body('*.mat_order_fg', '발주 사용유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_order_fg', '발주 사용유무')),
		body('*.mat_unit_uuid', '구매단위UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_unit_uuid', '구매단위UUID')),
		body('*.mat_order_min_qty', '발주 최소 단위수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_order_min_qty', '발주 최소 단위수량')),
		body('*.mat_supply_days', '발주 소요일').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'mat_supply_days', '발주 소요일')),
		body('*.sal_order_fg', '수주사용유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'sal_order_fg', '수주사용유무')),
		body('*.inv_use_fg', '창고 사용유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_use_fg', '창고 사용유무')),
		body('*.inv_unit_qty', '단위수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_unit_qty', '단위수량')),
		body('*.inv_safe_qty', '안전 재고수량').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_safe_qty', '안전 재고수량')),
		body('*.inv_to_store_uuid', '입고창고UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_to_store_uuid', '입고창고UUID')),
		body('*.inv_to_location_uuid', '입고 위치UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'inv_to_location_uuid', '입고 위치UUID')),
		body('*.qms_receive_insp_fg', '수입검사유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qms_receive_insp_fg', '수입검사유무')),
		body('*.qms_proc_insp_fg', '공정검사유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qms_proc_insp_fg', '공정검사유무')),
		body('*.qms_final_insp_fg', '최종검사유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'qms_final_insp_fg', '최종검사유무')),
		body('*.prd_active_fg', '생산품유무').optional({ nullable: true })
			.isBoolean().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_active_fg', '생산품유무')),
		body('*.prd_plan_type_uuid', '계획유형UUID').optional({ nullable: true })
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_plan_type_uuid', '계획유형UUID')),
		body('*.prd_min', '최소값').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_min', '최소값')),
		body('*.prd_max', '최대값').optional({ nullable: true })
			.isNumeric().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'prd_max', '최대값')),
  ],
  delete: [
		body('*.uuid', '품목UUID')
			.notEmpty().withMessage(value => createValidationError(value, stateTag, errorState.NO_INPUT_REQUIRED_PARAM, 400, 'uuid', '품목UUID'))
			.isUUID().withMessage(value => createValidationError(value, stateTag, errorState.INVALID_DATA_TYPE, 400, 'uuid', '품목UUID'))
  ],
};

export default stdProdValidation;