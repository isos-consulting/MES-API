import IAutMenu from '../../interfaces/aut/menu.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IAutMenu[] = [
	// [[ 기준정보 ]]
	{ menu_id: 1, menu_type_id: null, menu_nm: '기준정보', menu_uri: 'std', menu_form_nm: null, component_nm: null, icon: 'ico_nav_standard', parent_id: 0, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 2, menu_type_id: 2, menu_nm: '공장 관리', menu_uri: '\/std\/factories', menu_form_nm: 'frm_STD_Factory', component_nm: 'PgStdFactory', icon: null, parent_id: 1, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 3, menu_type_id: null, menu_nm: '거래처 정보', menu_uri: '\/std\/partner', menu_form_nm: null, component_nm: null, icon: null, parent_id: 1, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 4, menu_type_id: 2, menu_nm: '거래처유형 관리', menu_uri: '\/std\/partner-types', menu_form_nm: 'frm_STD_PartnerType', component_nm: 'PgStdPartnerType', icon: null, parent_id: 3, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 5, menu_type_id: 2, menu_nm: '거래처 관리', menu_uri: '\/std\/partners', menu_form_nm: 'frm_STD_Partner', component_nm: 'PgStdPartner', icon: null, parent_id: 3, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 6, menu_type_id: 2, menu_nm: '거래처 품번 관리', menu_uri: '\/std\/partner-prods', menu_form_nm: 'frm_STD_PartnerProd', component_nm: 'PgStdPartnerProd', icon: null, parent_id: 3, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 7, menu_type_id: 2, menu_nm: '공급처 관리', menu_uri: '\/std\/suppliers', menu_form_nm: 'frm_STD_Supplier', component_nm: 'PgStdSupplier', icon: null, parent_id: 3, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 8, menu_type_id: 2, menu_nm: '납품처 관리', menu_uri: '\/std\/deliveries', menu_form_nm: 'frm_STD_Delivery', component_nm: 'PgStdDelivery', icon: null, parent_id: 3, sortby: 5, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 9, menu_type_id: null, menu_nm: '단가 정보', menu_uri: '\/std\/price', menu_form_nm: null, component_nm: null, icon: null, parent_id: 1, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 10, menu_type_id: 2, menu_nm: '화폐단위 관리', menu_uri: '\/std\/money-units', menu_form_nm: 'frm_STD_MoneyUnit', component_nm: 'PgStdMoneyUnit', icon: null, parent_id: 9, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 11, menu_type_id: 2, menu_nm: '단가유형 관리', menu_uri: '\/std\/price-types', menu_form_nm: 'frm_STD_PriceType', component_nm: 'PgStdPriceType', icon: null, parent_id: 9, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 12, menu_type_id: 2, menu_nm: '구매단가 관리', menu_uri: '\/std\/vendor-prices', menu_form_nm: 'frm_STD_VendorPrice', component_nm: 'PgStdVendorPrice', icon: null, parent_id: 9, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 13, menu_type_id: 2, menu_nm: '판매단가 관리', menu_uri: '\/std\/customer-prices', menu_form_nm: 'frm_STD_CustomerPrice', component_nm: 'PgStdCustomerPrice', icon: null, parent_id: 9, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 14, menu_type_id: null, menu_nm: '사원 정보', menu_uri: '\/std\/emp', menu_form_nm: null, component_nm: null, icon: null, parent_id: 1, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 15, menu_type_id: 2, menu_nm: '부서 관리', menu_uri: '\/std\/depts', menu_form_nm: 'frm_STD_Dept', component_nm: 'PgStdDept', icon: null, parent_id: 14, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 16, menu_type_id: 2, menu_nm: '직급 관리', menu_uri: '\/std\/grades', menu_form_nm: 'frm_STD_Grade', component_nm: 'PgStdGrade', icon: null, parent_id: 14, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 17, menu_type_id: 2, menu_nm: '사원 관리', menu_uri: '\/std\/emps', menu_form_nm: 'frm_STD_Employee', component_nm: 'PgStdEmployee', icon: null, parent_id: 14, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 18, menu_type_id: 2, menu_nm: '공정 관리', menu_uri: '\/std\/procs', menu_form_nm: 'frm_STD_Process', component_nm: 'PgStdProcess', icon: null, parent_id: 1, sortby: 5, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 19, menu_type_id: 2, menu_nm: '작업장 관리', menu_uri: '\/std\/workings', menu_form_nm: 'frm_STD_Workings', component_nm: 'PgStdWorkings', icon: null, parent_id: 1, sortby: 6, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 20, menu_type_id: null, menu_nm: '설비 정보', menu_uri: '\/std\/equip', menu_form_nm: null, component_nm: null, icon: null, parent_id: 1, sortby: 7, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 21, menu_type_id: 2, menu_nm: '설비 유형 관리', menu_uri: '\/std\/equip-types', menu_form_nm: 'frm_STD_EquipmentType', component_nm: 'PgStdEquipmentType', icon: null, parent_id: 20, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 22, menu_type_id: 2, menu_nm: '설비 관리', menu_uri: '\/std\/equips', menu_form_nm: 'frm_STD_Equipment', component_nm: 'PgStdEquipment', icon: null, parent_id: 20, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 23, menu_type_id: 2, menu_nm: '공정별 설비 관리', menu_uri: '\/std\/proc-equips', menu_form_nm: null, component_nm: 'PgStdProcEquip', icon: null, parent_id: 20, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 24, menu_type_id: 2, menu_nm: '창고 관리', menu_uri: '\/std\/stores', menu_form_nm: 'frm_STD_Store', component_nm: 'PgStdStore', icon: null, parent_id: 1, sortby: 8, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 25, menu_type_id: 2, menu_nm: '위치 관리', menu_uri: '\/std\/locations', menu_form_nm: 'frm_STD_Location', component_nm: 'PgStdLocation', icon: null, parent_id: 1, sortby: 9, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 26, menu_type_id: null, menu_nm: '비가동 정보', menu_uri: '\/std\/downtime', menu_form_nm: null, component_nm: null, icon: null, parent_id: 1, sortby: 10, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 27, menu_type_id: 2, menu_nm: '비가동 유형 관리', menu_uri: '\/std\/downtime-types', menu_form_nm: 'frm_STD_DowntimeType', component_nm: 'PgStdDowntimeType', icon: null, parent_id: 26, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 28, menu_type_id: 2, menu_nm: '비가동 관리', menu_uri: '\/std\/downtimes', menu_form_nm: 'frm_STD_Downtime', component_nm: 'PgStdDowntime', icon: null, parent_id: 26, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 29, menu_type_id: null, menu_nm: '불량 정보', menu_uri: '\/std\/reject', menu_form_nm: null, component_nm: null, icon: null, parent_id: 1, sortby: 11, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 30, menu_type_id: 2, menu_nm: '불량유형 관리', menu_uri: '\/std\/reject-types', menu_form_nm: 'frm_STD_RejectType', component_nm: 'PgStdRejectType', icon: null, parent_id: 29, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 31, menu_type_id: 2, menu_nm: '불량 관리', menu_uri: '\/std\/rejects', menu_form_nm: 'frm_STD_Reject', component_nm: 'PgStdReject', icon: null, parent_id: 29, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 32, menu_type_id: 2, menu_nm: '공정별 불량 관리', menu_uri: '\/std\/proc-reject', menu_form_nm: 'frm_STD_ProcReject', component_nm: 'PgStdProcReject', icon: null, parent_id: 29, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 33, menu_type_id: null, menu_nm: '검사기준 정보', menu_uri: '\/std\/insp', menu_form_nm: null, component_nm: null, icon: null, parent_id: 1, sortby: 12, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 34, menu_type_id: 2, menu_nm: '검사기준 유형 관리', menu_uri: '\/std\/insp-item-types', menu_form_nm: 'frm_STD_InspItemType', component_nm: 'PgStdInspItemType', icon: null, parent_id: 33, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 35, menu_type_id: 2, menu_nm: '검사기준 관리', menu_uri: '\/std\/insp-items', menu_form_nm: 'frm_STD_InspItme', component_nm: 'PgStdInspItem', icon: null, parent_id: 33, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 36, menu_type_id: 2, menu_nm: '검사구 관리', menu_uri: '\/std\/insp-tools', menu_form_nm: 'frm_STD_InspTool', component_nm: 'PgStdInspTool', icon: null, parent_id: 33, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 37, menu_type_id: 2, menu_nm: '검사방법 관리', menu_uri: '\/std\/insp-methods', menu_form_nm: 'frm_STD_InspMethod', component_nm: 'PgStdInspMethod', icon: null, parent_id: 33, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 38, menu_type_id: null, menu_nm: '작업 리소스 정보', menu_uri: '\/std\/work-resource', menu_form_nm: null, component_nm: null, icon: null, parent_id: 1, sortby: 13, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 39, menu_type_id: 2, menu_nm: '작업교대 관리', menu_uri: '\/std\/shifts', menu_form_nm: 'frm_STD_Shift', component_nm: 'PgStdShift', icon: null, parent_id: 38, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 40, menu_type_id: 2, menu_nm: '작업조 관리', menu_uri: '\/std\/worker-groups', menu_form_nm: 'frm_STD_WorkerGroup', component_nm: 'PgStdWorkerGroup', icon: null, parent_id: 38, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			// { menu_id: 41, menu_type_id: 2, menu_nm: '작업자 관리', menu_uri: '\/std\/workers', menu_form_nm: 'frm_STD_Worker', component_nm: 'PgStdWorker', icon: null, parent_id: 38, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 42, menu_type_id: 2, menu_nm: '작업조별 작업자 관리', menu_uri: '\/std\/worker-group-workers', menu_form_nm: 'frm_STD_WorkerGroupWorker', component_nm: 'PgStdWorkerGroupWorker', icon: null, parent_id: 38, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 43, menu_type_id: null, menu_nm: '단위 정보', menu_uri: '\/std\/unit', menu_form_nm: null, component_nm: null, icon: null, parent_id: 1, sortby: 14, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 44, menu_type_id: 2, menu_nm: '단위 관리', menu_uri: '\/std\/units', menu_form_nm: 'frm_STD_Unit', component_nm: 'PgStdUnit', icon: null, parent_id: 43, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 45, menu_type_id: 2, menu_nm: '단위 변환값 관리', menu_uri: '\/std\/unit-converts', menu_form_nm: 'frm_STD_UnitConvert', component_nm: 'PgStdUnitConvert', icon: null, parent_id: 43, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 46, menu_type_id: null, menu_nm: '권한 정보', menu_uri: '\/std\/aut', menu_form_nm: null, component_nm: null, icon: null, parent_id: 1, sortby: 15, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 47, menu_type_id: 2, menu_nm: '권한기준 관리', menu_uri: '\/std\/aut\/permissions', menu_form_nm: 'frm_AUT_Permission', component_nm: 'PgAutPermission', icon: null, parent_id: 46, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 48, menu_type_id: 2, menu_nm: '권한그룹 관리', menu_uri: '\/std\/aut\/groups', menu_form_nm: 'frm_AUT_Group', component_nm: 'PgAutGroup', icon: null, parent_id: 46, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 49, menu_type_id: 2, menu_nm: '그룹별 권한 관리', menu_uri: '\/std\/aut\/group-permissions', menu_form_nm: 'frm_AUT_GroupPermission', component_nm: 'PgAutGroupPermission', icon: null, parent_id: 46, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 50, menu_type_id: 2, menu_nm: '사용자 관리', menu_uri: '\/std\/aut\/users', menu_form_nm: 'frm_AUT_User', component_nm: 'PgAutUser', icon: null, parent_id: 46, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 51, menu_type_id: 2, menu_nm: '사용자권한 관리', menu_uri: '\/std\/aut\/user-permissions', menu_form_nm: 'frm_AUT_UserPermission', component_nm: 'PgAutUserPermission', icon: null, parent_id: 46, sortby: 5, use_fg: true, created_uid: 1, updated_uid: 1 },
	
	// [[ 사양관리 ]]
	{ menu_id: 52, menu_type_id: null, menu_nm: '사양관리', menu_uri: 'spec', menu_form_nm: null, component_nm: null, icon: 'ico_nav_standard', parent_id: 0, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 53, menu_type_id: null, menu_nm: '품목 정보', menu_uri: '\/spec\/item', menu_form_nm: null, component_nm: null, icon: null, parent_id: 52, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 54, menu_type_id: 2, menu_nm: '품목유형 관리', menu_uri: '\/spec\/item-types', menu_form_nm: 'frm_STD_ItemType', component_nm: 'PgStdItemType', icon: null, parent_id: 53, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 55, menu_type_id: 2, menu_nm: '모델 관리', menu_uri: '\/spec\/models', menu_form_nm: 'frm_STD_Model', component_nm: 'PgStdModel', icon: null, parent_id: 53, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 56, menu_type_id: 2, menu_nm: '제품유형 관리', menu_uri: '\/spec\/prod-types', menu_form_nm: 'frm_STD_ProdTYpe', component_nm: 'PgStdProdType', icon: null, parent_id: 53, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 57, menu_type_id: 2, menu_nm: '품목 관리', menu_uri: '\/spec\/prods', menu_form_nm: 'frm_STD_Prod', component_nm: 'PgStdProd', icon: null, parent_id: 53, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 58, menu_type_id: 2, menu_nm: '라우팅 관리', menu_uri: '\/spec\/routings', menu_form_nm: 'frm_STD_Routing', component_nm: 'PgStdRouting', icon: null, parent_id: 52, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 59, menu_type_id: 2, menu_nm: 'BOM 관리', menu_uri: '\/spec\/boms', menu_form_nm: 'frm_STD_BOM', component_nm: 'PgStdBom', icon: null, parent_id: 52, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
	
	// [[ 구매/자재 관리 ]]
	{ menu_id: 60, menu_type_id: null, menu_nm: '구매\/자재관리', menu_uri: 'mat', menu_form_nm: null, component_nm: null, icon: 'ico_nav_material', parent_id: 0, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 61, menu_type_id: null, menu_nm: '발주 정보', menu_uri: '\/mat\/order', menu_form_nm: null, component_nm: null, icon: null, parent_id: 60, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 62, menu_type_id: 2, menu_nm: '발주 관리', menu_uri: '\/mat\/orders', menu_form_nm: 'frm_MAT_Order', component_nm: 'PgMatOrder', icon: null, parent_id: 61, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 63, menu_type_id: 1, menu_nm: '발주 현황', menu_uri: '\/mat\/order-reports', menu_form_nm: 'frm_MAT_OrderReport', component_nm: 'PgMatOrderReport', icon: null, parent_id: 61, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 64, menu_type_id: null, menu_nm: '입하 정보', menu_uri: '\/mat\/receive', menu_form_nm: null, component_nm: null, icon: null, parent_id: 60, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 65, menu_type_id: 2, menu_nm: '입하 관리', menu_uri: '\/mat\/receives', menu_form_nm: 'frm_MAT_Receive', component_nm: 'PgMatReceive', icon: null, parent_id: 64, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 66, menu_type_id: 1, menu_nm: '입하 현황', menu_uri: '\/mat\/receive-reports', menu_form_nm: 'frm_MAT_ReceiveReport', component_nm: 'PgMatReceiveReport', icon: null, parent_id: 64, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 67, menu_type_id: null, menu_nm: '반출 정보', menu_uri: '\/mat\/return', menu_form_nm: null, component_nm: null, icon: null, parent_id: 60, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 68, menu_type_id: 2, menu_nm: '반출 관리', menu_uri: '\/mat\/returns', menu_form_nm: 'frm_MAT_Retrun', component_nm: 'PgMatReturn', icon: null, parent_id: 67, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 69, menu_type_id: 1, menu_nm: '반출 현황', menu_uri: '\/mat\/return-reports', menu_form_nm: 'frm_MAT_ReturnReport', component_nm: 'PgMatReturnReport', icon: null, parent_id: 67, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 70, menu_type_id: null, menu_nm: '자재출고 정보', menu_uri: '\/mat\/release', menu_form_nm: null, component_nm: null, icon: null, parent_id: 60, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 71, menu_type_id: 2, menu_nm: '자재출고 관리', menu_uri: '\/mat\/releases', menu_form_nm: 'frm_MAT_Release', component_nm: 'PgMatRelease', icon: null, parent_id: 70, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 72, menu_type_id: 1, menu_nm: '자재출고 현황', menu_uri: '\/mat\/release-reports', menu_form_nm: 'frm_MAT_ReleaseReport', component_nm: 'PgMatReleaseReport', icon: null, parent_id: 70, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 73, menu_type_id: 1, menu_nm: '입하기준 LOT추적', menu_uri: '\/mat\/receive-lot-tracking', menu_form_nm: null, component_nm: 'PgMatReceiveLotTracking', icon: null, parent_id: 60, sortby: 5, use_fg: true, created_uid: 1, updated_uid: 1 },
	
	// [[ 생산관리 ]]
	{ menu_id: 74, menu_type_id: null, menu_nm: '생산관리', menu_uri: 'prd', menu_form_nm: null, component_nm: null, icon: 'ico_nav_production', parent_id: 0, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 75, menu_type_id: 2, menu_nm: '작업지시관리', menu_uri: '\/prd\/orders', menu_form_nm: 'frm_PRD_Order', component_nm: 'PgPrdOrder', icon: null, parent_id: 74, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 76, menu_type_id: 2, menu_nm: '자재출고요청 관리', menu_uri: '\/prd\/demands', menu_form_nm: 'frm_PRD_Demand', component_nm: 'PgPrdDemand', icon: null, parent_id: 74, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 77, menu_type_id: null, menu_nm: '작업실적 정보', menu_uri: '\/prd\/work', menu_form_nm: null, component_nm: null, icon: null, parent_id: 74, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 78, menu_type_id: 2, menu_nm: '작업실적관리', menu_uri: '\/prd\/works', menu_form_nm: 'frm_PRD_Work', component_nm: 'PgPrdWork', icon: null, parent_id: 77, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 79, menu_type_id: 1, menu_nm: '생산실적현황', menu_uri: '\/prd\/work-reports', menu_form_nm: 'frm_PRD_WorkReport', component_nm: 'PgPrdWorkReport', icon: null, parent_id: 77, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 80, menu_type_id: 1, menu_nm: '비가동현황', menu_uri: '\/prd\/work-downtime-reports', menu_form_nm: 'frm_PRD_WorkDowntimeReport', component_nm: 'PgPrdWorkDowntimeReport', icon: null, parent_id: 77, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 81, menu_type_id: 1, menu_nm: '불량현황', menu_uri: '\/prd\/work-reject-reports', menu_form_nm: 'frm_PRD_WorkRejectReport', component_nm: 'PgPrdWorkRejectReport', icon: null, parent_id: 77, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 82, menu_type_id: null, menu_nm: '자재반납 정보', menu_uri: '\/prd\/return', menu_form_nm: null, component_nm: null, icon: null, parent_id: 74, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 83, menu_type_id: 2, menu_nm: '자재반납 관리', menu_uri: '\/prd\/returns', menu_form_nm: 'frm_PRD_Return', component_nm: 'PgPrdReturn', icon: null, parent_id: 82, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 84, menu_type_id: 1, menu_nm: '자재반납 현황', menu_uri: '\/prd\/return-reports', menu_form_nm: 'frm_PRD_ReturnReport', component_nm: 'PgPrdReturnReport', icon: null, parent_id: 82, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
	
	// [[ 영업/제품 관리 ]]
	{ menu_id: 85, menu_type_id: null, menu_nm: '영업\/제품관리', menu_uri: 'sal', menu_form_nm: null, component_nm: null, icon: 'ico_nav_sales', parent_id: 0, sortby: 5, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 86, menu_type_id: null, menu_nm: '수주 정보', menu_uri: '\/sal\/order', menu_form_nm: null, component_nm: null, icon: null, parent_id: 85, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 87, menu_type_id: 2, menu_nm: '수주 관리', menu_uri: '\/sal\/orders', menu_form_nm: 'frm_SAL_Order', component_nm: 'PgSalOrder', icon: null, parent_id: 86, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1},
			{ menu_id: 88, menu_type_id: 1, menu_nm: '수주 현황', menu_uri: '\/sal\/order-reports', menu_form_nm: 'frm_SAL_OrderReport', component_nm: 'PgSalOrdersReport', icon: null, parent_id: 86, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 89, menu_type_id: null, menu_nm: '제품출하 정보', menu_uri: '\/sal\/outgo', menu_form_nm: null, component_nm: null, icon: null, parent_id: 85, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 90, menu_type_id: 2, menu_nm: '제품출하지시 관리', menu_uri: '\/sal\/outgo-orders', menu_form_nm: 'frm_SAL_OutgoOrder', component_nm: 'PgSalOutgoOrder', icon: null, parent_id: 89, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 91, menu_type_id: 2, menu_nm: '제품출하 관리', menu_uri: '\/sal\/outgos', menu_form_nm: 'frm_SAL_Outgo', component_nm: 'PgSalOutgo', icon: null, parent_id: 89, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 92, menu_type_id: 1, menu_nm: '제품출하지시 현황', menu_uri: '\/sal\/outgo-order-reports', menu_form_nm: 'frm_SAL_OutgoOrderReport', component_nm: 'PsSalOutgoOrderReport', icon: null, parent_id: 89, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 93, menu_type_id: 1, menu_nm: '제품출하 현황', menu_uri: '\/sal\/outgo-reports', menu_form_nm: 'frm_SAL_OutgoReport', component_nm: 'PgSalOutgoReport', icon: null, parent_id: 89, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 94, menu_type_id: null, menu_nm: '제품입고 정보', menu_uri: '\/sal\/income', menu_form_nm: null, component_nm: null, icon: null, parent_id: 85, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 95, menu_type_id: 2, menu_nm: '제품입고 관리', menu_uri: '\/sal\/incomes', menu_form_nm: 'frm_SAL_Income', component_nm: 'PgSalIncome', icon: null, parent_id: 94, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 96, menu_type_id: 1, menu_nm: '제품입고 현황', menu_uri: '\/sal\/income-reports', menu_form_nm: 'frm_SAL_IncomeReport', component_nm: 'PgSalIncomesReport', icon: null, parent_id: 94, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 97, menu_type_id: null, menu_nm: '제품출고 정보', menu_uri: '\/sal\/release', menu_form_nm: null, component_nm: null, icon: null, parent_id: 85, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 98, menu_type_id: 2, menu_nm: '제품출고 관리', menu_uri: '\/sal\/releases', menu_form_nm: 'frm_SAL_Release', component_nm: 'PgSalRelease', icon: null, parent_id: 97, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 99, menu_type_id: 1, menu_nm: '제품출고 현황', menu_uri: '\/sal\/release-reports', menu_form_nm: 'frm_SAL_ReleaseReport', component_nm: 'PgSalReleaseReport', icon: null, parent_id: 97, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 100, menu_type_id: null, menu_nm: '제품반입 정보', menu_uri: '\/sal\/return', menu_form_nm: null, component_nm: null, icon: null, parent_id: 85, sortby: 5, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 101, menu_type_id: 2, menu_nm: '제품반입 관리', menu_uri: '\/sal\/returns', menu_form_nm: 'frm_SAL_Return', component_nm: 'PgSalReturn', icon: null, parent_id: 100, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 102, menu_type_id: 1, menu_nm: '제품반입 현황', menu_uri: '\/sal\/return-reports', menu_form_nm: 'frm_SAL_ReturnReport', component_nm: 'PgSalReturnReport', icon: null, parent_id: 100, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 103, menu_type_id: 1, menu_nm: '출하기준 LOT추적', menu_uri: '\/sal\/outgo-lot-tracking', menu_form_nm: null, component_nm: 'PgSalOutgoLotTracking', icon: null, parent_id: 85, sortby: 6, use_fg: true, created_uid: 1, updated_uid: 1 },

	// [[ 외주관리 ]]
	{ menu_id: 104, menu_type_id: null, menu_nm: '외주관리', menu_uri: 'out', menu_form_nm: null, component_nm: null, icon: 'ico_nav_outsourcing', parent_id: 0, sortby: 6, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 105, menu_type_id: null, menu_nm: '외주출고 정보', menu_uri: '\/out\/release', menu_form_nm: null, component_nm: null, icon: null, parent_id: 104, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 106, menu_type_id: 2, menu_nm: '외주출고 관리', menu_uri: '\/out\/releases', menu_form_nm: 'frm_OUT_Release', component_nm: 'PgOutRelease', icon: null, parent_id: 105, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 107, menu_type_id: 1, menu_nm: '외주출고 현황', menu_uri: '\/out\/release-reports', menu_form_nm: 'frm_OUT_ReleaseReport', component_nm: 'PgOutReleaseReport', icon: null, parent_id: 105, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 108, menu_type_id: null, menu_nm: '외주입하 정보', menu_uri: '\/out\/receive', menu_form_nm: null, component_nm: null, icon: null, parent_id: 104, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 109, menu_type_id: 2, menu_nm: '외주입하 관리', menu_uri: '\/out\/receives', menu_form_nm: 'frm_OUT_Receive', component_nm: 'PgOutReceive', icon: null, parent_id: 108, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 110, menu_type_id: 1, menu_nm: '외주입하 현황', menu_uri: '\/out\/receive-reports', menu_form_nm: 'frm_OUT_ReceiveReport', component_nm: 'PgOutReceiveReport', icon: null, parent_id: 108, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
	
	// [[ 품질관리 ]]
	{ menu_id: 111, menu_type_id: null, menu_nm: '품질관리', menu_uri: 'qms', menu_form_nm: null, component_nm: null, icon: 'ico_nav_qualityManagementSystems', parent_id: 0, sortby: 7, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 112, menu_type_id: 2, menu_nm: '검사기준서 관리', menu_uri: '\/qms\/insps', menu_form_nm: 'frm_QMS_Insp', component_nm: 'PgQmsInsp', icon: null, parent_id: 111, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 113, menu_type_id: null, menu_nm: '수입검사 정보', menu_uri: '\/qms\/receive', menu_form_nm: null, component_nm: null, icon: null, parent_id: 111, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 114, menu_type_id: 2, menu_nm: '수입검사 성적서 관리', menu_uri: '\/qms\/receive-insp-results', menu_form_nm: 'frm_QMS_ReceiveInspResult', component_nm: 'PgQmsReceiveInspResult', icon: null, parent_id: 113, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 115, menu_type_id: 2, menu_nm: '수입검사 결과 현황', menu_uri: '\/qms\/receive-insp-result-reports', menu_form_nm: null, component_nm: 'PgQmsReceiveInspResultReport', icon: null, parent_id: 113, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 116, menu_type_id: null, menu_nm: '공정검사 정보', menu_uri: '\/qms\/proc-insp', menu_form_nm: null, component_nm: null, icon: null, parent_id: 111, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 117, menu_type_id: 2, menu_nm: '공정검사 성적서 관리', menu_uri: '\/qms\/proc-insp-results', menu_form_nm: 'frm_QMS_ProcInspResult', component_nm: 'PgQmsProcInspResult', icon: null, parent_id: 116, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 118, menu_type_id: 2, menu_nm: '공정검사 결과 현황', menu_uri: '\/qms\/proc-insp-result-reports', menu_form_nm: null, component_nm: 'PgQmsProcInspResultReport', icon: null, parent_id: 116, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 119, menu_type_id: null, menu_nm: '최종검사 정보', menu_uri: '\/qms\/final-insp', menu_form_nm: null, component_nm: null, icon: null, parent_id: 111, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 120, menu_type_id: 2, menu_nm: '최종검사 성적서 관리', menu_uri: '\/qms\/final-insp-results', menu_form_nm: 'frm_QMS_FinalInspResult', component_nm: 'PgQmsFinalInspResult', icon: null, parent_id: 119, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 121, menu_type_id: 2, menu_nm: '최종검사 결과 현황', menu_uri: '\/qms\/final-insp-result-reports', menu_form_nm: null, component_nm: 'PgQmsFinalInspResultReport', icon: null, parent_id: 119, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 122, menu_type_id: null, menu_nm: '부적합품 판정 정보', menu_uri: '\/qms\/rework', menu_form_nm: null, component_nm: null, icon: null, parent_id: 111, sortby: 5, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 123, menu_type_id: 2, menu_nm: '부적합품 판정 관리', menu_uri: '\/qms\/reworks', menu_form_nm: 'frm_QMS_Rework', component_nm: 'PgQmsRework', icon: null, parent_id: 122, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 124, menu_type_id: 1, menu_nm: '부적합품 판정 현황', menu_uri: '\/qms\/rework-reports', menu_form_nm: null, component_nm: 'PgQmsReworkReport', icon: null, parent_id: 122, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
	
	// [[ 재고관리 ]]
	{ menu_id: 125, menu_type_id: null, menu_nm: '재고관리', menu_uri: 'inv', menu_form_nm: null, component_nm: null, icon: 'ico_nav_inventory', parent_id: 0, sortby: 8, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 126, menu_type_id: 1, menu_nm: '재고현황', menu_uri: '\/inv\/stores\/stocks', menu_form_nm: null, component_nm: 'PgInvStoresStocks', icon: null, parent_id: 125, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 127, menu_type_id: null, menu_nm: '재고실사 정보', menu_uri: '\/inv\/store', menu_form_nm: null, component_nm: null, icon: null, parent_id: 125, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 128, menu_type_id: 2, menu_nm: '재고실사 관리', menu_uri: '\/inv\/stores', menu_form_nm: 'frm_INV_Store', component_nm: 'PgInvStore', icon: null, parent_id: 127, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 129, menu_type_id: 1, menu_nm: '재고실사 현황', menu_uri: '\/inv\/store-reports', menu_form_nm: null, component_nm: 'PgInvStoreReport', icon: null, parent_id: 127, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 130, menu_type_id: null, menu_nm: '창고이동 정보', menu_uri: '\/inv\/move', menu_form_nm: null, component_nm: null, icon: null, parent_id: 125, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 131, menu_type_id: 2, menu_nm: '창고이동 관리', menu_uri: '\/inv\/moves', menu_form_nm: 'frm_INV_Move', component_nm: 'PgInvMove', icon: null, parent_id: 130, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 132, menu_type_id: 1, menu_nm: '창고이동 현황', menu_uri: '\/inv\/move-reports', menu_form_nm: null, component_nm: 'PgInvMoveReport', icon: null, parent_id: 130, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 133, menu_type_id: null, menu_nm: '수불 정보', menu_uri: '\/inv\/history', menu_form_nm: null, component_nm: null, icon: null, parent_id: 125, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 134, menu_type_id: 1, menu_nm: '총괄수불부', menu_uri: '\/inv\/history\/total-history', menu_form_nm: null, component_nm: 'PgInvStoresTotalHistory', icon: null, parent_id: 133, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 135, menu_type_id: 1, menu_nm: '개별수불부', menu_uri: '\/inv\/history\/individual-history', menu_form_nm: null, component_nm: 'PgInvStoresIndividualHistory', icon: null, parent_id: 133, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 136, menu_type_id: 1, menu_nm: '유형별 수불부', menu_uri: '\/inv\/history\/type-history', menu_form_nm: null, component_nm: 'PgInvStoresTypeHistory', icon: null, parent_id: 133, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 137, menu_type_id: 2, menu_nm: '재고 부적합 관리', menu_uri: '\/inv\/stock-rejects', menu_form_nm: 'frm_INV_StockReject', component_nm: 'PgInvStockReject', icon: null, parent_id: 125, sortby: 5, use_fg: true, created_uid: 1, updated_uid: 1 },
	
	// [[ 금형관리 ]]
	{ menu_id: 138, menu_type_id: null, menu_nm: '금형관리', menu_uri: 'mld', menu_form_nm: null, component_nm: null, icon: 'ico_nav_mold', parent_id: 0, sortby: 9, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 139, menu_type_id: 2, menu_nm: '금형 관리', menu_uri: '\/mld\/mold', menu_form_nm: null, component_nm: 'PgMldMold', icon: null, parent_id: 138, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 140, menu_type_id: 2, menu_nm: '금형 문제점 관리', menu_uri: '\/mld\/problem', menu_form_nm: null, component_nm: 'PgMldProblem', icon: null, parent_id: 138, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 141, menu_type_id: 2, menu_nm: '금형 수리 관리', menu_uri: '\/mld\/repair', menu_form_nm: null, component_nm: 'PgMldRepairHistory', icon: null, parent_id: 138, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 142, menu_type_id: 2, menu_nm: '금형 품목 관리', menu_uri: '\/mld\/mold-prod', menu_form_nm: null, component_nm: 'PgMldProdMold', icon: null, parent_id: 138, sortby: 4, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 143, menu_type_id: 2, menu_nm: '생산타수현황', menu_uri: '\/mld\/mold-lifes', menu_form_nm: null, component_nm: 'PgMldMoldReport', icon: null, parent_id: 138, sortby: 5, use_fg: true, created_uid: 1, updated_uid: 1 },

	// [[ 설비관리 ]]
	{ menu_id: 144, menu_type_id: null, menu_nm: '설비관리', menu_uri: 'eqm', menu_form_nm: null, component_nm: null, icon: 'ico_nav_equipment', parent_id: 0, sortby: 10, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 145, menu_type_id: 2, menu_nm: '설비등록대장', menu_uri: '\/eqm\/history-cards', menu_form_nm: null, component_nm: 'PgEqmHistoryCard', icon: null, parent_id: 144, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 146, menu_type_id: 2, menu_nm: '설비수리이력 관리', menu_uri: '\/eqm\/repair-history', menu_form_nm: null, component_nm: 'PgEqmRepairHistory', icon: null, parent_id: 144, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
		{ menu_id: 147, menu_type_id: null, menu_nm: '설비점검 정보', menu_uri: '\/eqm\/insp', menu_form_nm: null, component_nm: null, icon: null, parent_id: 144, sortby: 3, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 148, menu_type_id: 2, menu_nm: '설비점검 기준서 관리', menu_uri: '\/eqm\/insp\/insps', menu_form_nm: null, component_nm: 'PgEqmInsp', icon: null, parent_id: 147, sortby: 1, use_fg: true, created_uid: 1, updated_uid: 1 },
			{ menu_id: 149, menu_type_id: 2, menu_nm: '설비점검 성적서 관리', menu_uri: '\/eqm\/insp-result', menu_form_nm: null, component_nm: 'PgEqmInspResult', icon: null, parent_id: 147, sortby: 2, use_fg: true, created_uid: 1, updated_uid: 1 },
];

const baseMigration = new BaseMigration('AutMenu', 'menu_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };