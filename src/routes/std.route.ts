import * as express from 'express';

import StdBomCtl from '../controllers/std/bom.controller';
import StdCompanyCtl from '../controllers/std/company.controller';
import StdCustomerPriceCtl from '../controllers/std/customer-price.controller';
import StdDeliveryCtl from '../controllers/std/delivery.controller';
import StdDeptCtl from '../controllers/std/dept.controller';
import StdDowntimeTypeCtl from '../controllers/std/downtime-type.controller';
import StdDowntimeCtl from '../controllers/std/downtime.controller';
import StdEmpCtl from '../controllers/std/emp.controller';
import StdEquipTypeCtl from '../controllers/std/equip-type.controller';
import StdEquipCtl from '../controllers/std/equip.controller';
import StdFactoryCtl from '../controllers/std/factory.controller';
import StdGradeCtl from '../controllers/std/grade.controller';
import StdInspItemTypeCtl from '../controllers/std/insp-item-type.controller';
import StdInspItemCtl from '../controllers/std/insp-item.controller';
import StdInspMethodCtl from '../controllers/std/insp-method.controller';
import StdInspToolCtl from '../controllers/std/insp-tool.controller';
import StdItemTypeCtl from '../controllers/std/item-type.controller';
import StdLocationCtl from '../controllers/std/location.controller';
import StdModelCtl from '../controllers/std/model.controller';
import StdMoneyUnitCtl from '../controllers/std/money-unit.controller';
import StdPartnerProdCtl from '../controllers/std/partner-prod.controller';
import StdPartnerTypeCtl from '../controllers/std/partner-type.controller';
import StdPartnerCtl from '../controllers/std/partner.controller';
import StdPriceTypeCtl from '../controllers/std/price-type.controller';
import StdProcRejectCtl from '../controllers/std/proc-reject.controller';
import StdProcCtl from '../controllers/std/proc.controller';
import StdProdTypeCtl from '../controllers/std/prod-type.controller';
import StdProdCtl from '../controllers/std/prod.controller';
import StdRejectTypeCtl from '../controllers/std/reject-type.controller';
import StdRejectCtl from '../controllers/std/reject.controller';
import StdRoutingResourceCtl from '../controllers/std/routing-resource.controller';
import StdRoutingWorkingsCtl from '../controllers/std/routing-workings.controller';
import StdRoutingCtl from '../controllers/std/routing.controller';
import StdShiftCtl from '../controllers/std/shift.controller';
import StdStoreCtl from '../controllers/std/store.controller';
import StdSupplierCtl from '../controllers/std/supplier.controller';
import StdTenantOptCtl from '../controllers/std/tenant-opt.controller';
import StdUnitConvertCtl from '../controllers/std/unit-convert.controller';
import StdUnitCtl from '../controllers/std/unit.controller';
import StdVendorPriceCtl from '../controllers/std/vendor-price.controller';
import StdWorkerGroupWorkerCtl from '../controllers/std/worker-group-worker.controller';
import StdWorkerGroupCtl from '../controllers/std/worker-group.controller';
import StdWorkerCtl from '../controllers/std/worker.controller';
import StdWorkingsCtl from '../controllers/std/workings.controller';
import validationCallback from '../utils/validationCallback';
import stdDowntimeValidation from '../validations/std/downtime.validation';
import stdEquipValidation from '../validations/std/equip.validation';
import stdInspItemValidation from '../validations/std/insp-item.validation';
import stdRoutingResourceValidation from '../validations/std/routing-resource.validation';
import stdTenantOptValidation from '../validations/std/tenant-opt.validation';

const router = express.Router();

//#region ✅ BOM (BOM)
const bom = new StdBomCtl();
router.route('/boms/trees').get(bom.readToTrees);
router.route('/bom/:uuid').get(bom.read);
router.route('/boms').get(bom.read);
router.route('/boms').post(bom.create);
router.route('/boms').put(bom.update);
router.route('/boms').patch(bom.patch);
router.route('/boms').delete(bom.delete);
//#endregion

//#region ✅ PartnerType (거래처 유형)
const partnerType = new StdPartnerTypeCtl();
router.route('/partner-types/excel-upload').post(partnerType.upsertBulkDatasFromExcel);
router.route('/partner-type/:uuid').get(partnerType.read);
router.route('/partner-types').get(partnerType.read);
router.route('/partner-types').post(partnerType.create);
router.route('/partner-types').put(partnerType.update);
router.route('/partner-types').patch(partnerType.patch);
router.route('/partner-types').delete(partnerType.delete);
//#endregion

//#region ✅ Partner (거래처)
const partner = new StdPartnerCtl();
router.route('/partners/excel-upload').post(partner.upsertBulkDatasFromExcel);
router.route('/partner/:uuid').get(partner.read);
router.route('/partners').get(partner.read);
router.route('/partners').post(partner.create);
router.route('/partners').put(partner.update);
router.route('/partners').patch(partner.patch);
router.route('/partners').delete(partner.delete);
//#endregion

//#region ✅ PartnerProd (거래처 품목)
const partnerProd = new StdPartnerProdCtl();
router.route('/partner-prods/excel-upload').post(partnerProd.upsertBulkDatasFromExcel);
router.route('/partner-prod/:uuid').get(partnerProd.read);
router.route('/partner-prods').get(partnerProd.read);
router.route('/partner-prods').post(partnerProd.create);
router.route('/partner-prods').put(partnerProd.update);
router.route('/partner-prods').patch(partnerProd.patch);
router.route('/partner-prods').delete(partnerProd.delete);
//#endregion

//#region ✅ InspTool (검사구)
const inspTool = new StdInspToolCtl();
router.route('/insp-tools/excel-upload').post(inspTool.upsertBulkDatasFromExcel);
router.route('/insp-tool/:uuid').get(inspTool.read);
router.route('/insp-tools').get(inspTool.read);
router.route('/insp-tools').post(inspTool.create);
router.route('/insp-tools').put(inspTool.update);
router.route('/insp-tools').patch(inspTool.patch);
router.route('/insp-tools').delete(inspTool.delete);
//#endregion

//#region ✅ InspMethod (검사방법)
const inspMethod = new StdInspMethodCtl();
router.route('/insp-methods/excel-upload').post(inspMethod.upsertBulkDatasFromExcel);
router.route('/insp-method/:uuid').get(inspMethod.read);
router.route('/insp-methods').get(inspMethod.read);
router.route('/insp-methods').post(inspMethod.create);
router.route('/insp-methods').put(inspMethod.update);
router.route('/insp-methods').patch(inspMethod.patch);
router.route('/insp-methods').delete(inspMethod.delete);
//#endregion

//#region ✅ InspItemType (검사항목 유형)
const inspItemType = new StdInspItemTypeCtl();
router.route('/insp-item-types/excel-upload').post(inspItemType.upsertBulkDatasFromExcel);
router.route('/insp-item-type/:uuid').get(inspItemType.read);
router.route('/insp-item-types').get(inspItemType.read);
router.route('/insp-item-types').post(inspItemType.create);
router.route('/insp-item-types').put(inspItemType.update);
router.route('/insp-item-types').patch(inspItemType.patch);
router.route('/insp-item-types').delete(inspItemType.delete);
//#endregion

//#region ✅ InspItem (검사항목)
const inspItem = new StdInspItemCtl();
router.route('/insp-item/:uuid').get(stdInspItemValidation.readByUuid, validationCallback, inspItem.read);
router.route('/insp-items').get(stdInspItemValidation.read, validationCallback, inspItem.read);
router.route('/insp-items').post(stdInspItemValidation.create, validationCallback, inspItem.create);
router.route('/insp-items').put(stdInspItemValidation.update, validationCallback, inspItem.update);
router.route('/insp-items').patch(stdInspItemValidation.patch, validationCallback, inspItem.patch);
router.route('/insp-items').delete(stdInspItemValidation.delete, validationCallback, inspItem.delete);
//#endregion

//#region ✅ CustomerPrice (고객사 단가)
const customerPrice = new StdCustomerPriceCtl();
router.route('/customer-prices/excel-upload').post(customerPrice.upsertBulkDatasFromExcel);
router.route('/customer-price/:uuid').get(customerPrice.read);
router.route('/customer-prices').get(customerPrice.read);
router.route('/customer-prices').post(customerPrice.create);
router.route('/customer-prices').put(customerPrice.update);
router.route('/customer-prices').patch(customerPrice.patch);
router.route('/customer-prices').delete(customerPrice.delete);
//#endregion

//#region ✅ Supplier (공급처)
const supplier = new StdSupplierCtl();
router.route('/suppliers/excel-upload').post(supplier.upsertBulkDatasFromExcel);
router.route('/supplier/:uuid').get(supplier.read);
router.route('/suppliers').get(supplier.read);
router.route('/suppliers').post(supplier.create);
router.route('/suppliers').put(supplier.update);
router.route('/suppliers').patch(supplier.patch);
router.route('/suppliers').delete(supplier.delete);
//#endregion

//#region ✅ Factory (공장)
const factory = new StdFactoryCtl();
router.route('/factories/excel-upload').post(factory.upsertBulkDatasFromExcel);
router.route('/factory/:uuid').get(factory.read);
router.route('/factories/sign-in').get(factory.readForSignIn);
router.route('/factories').get(factory.read);
router.route('/factories').post(factory.create);
router.route('/factories').put(factory.update);
router.route('/factories').patch(factory.patch);
router.route('/factories').delete(factory.delete);
//#endregion

//#region ✅ Proc (공정)
const proc = new StdProcCtl();
router.route('/procs/excel-upload').post(proc.upsertBulkDatasFromExcel);
router.route('/proc/:uuid').get(proc.read);
router.route('/procs').get(proc.read);
router.route('/procs').post(proc.create);
router.route('/procs').put(proc.update);
router.route('/procs').patch(proc.patch);
router.route('/procs').delete(proc.delete);
//#endregion

//#region ✅ ProcReject (공정별 부적합)
const procReject = new StdProcRejectCtl();
router.route('/proc-rejects/excel-upload').post(procReject.upsertBulkDatasFromExcel);
router.route('/proc-reject/:uuid').get(procReject.read);
router.route('/proc-rejects').get(procReject.read);
router.route('/proc-rejects').post(procReject.create);
router.route('/proc-rejects').put(procReject.update);
router.route('/proc-rejects').patch(procReject.patch);
router.route('/proc-rejects').delete(procReject.delete);
//#endregion

//#region ✅ Delivery (납품처)
const delivery = new StdDeliveryCtl();
router.route('/deliveries/excel-upload').post(delivery.upsertBulkDatasFromExcel);
router.route('/delivery/:uuid').get(delivery.read);
router.route('/deliveries').get(delivery.read);
router.route('/deliveries').post(delivery.create);
router.route('/deliveries').put(delivery.update);
router.route('/deliveries').patch(delivery.patch);
router.route('/deliveries').delete(delivery.delete);
//#endregion

//#region ✅ PriceType (단가유형)
const priceType = new StdPriceTypeCtl();
router.route('/price-types/excel-upload').post(priceType.upsertBulkDatasFromExcel);
router.route('/price-type/:uuid').get(priceType.read);
router.route('/price-types').get(priceType.read);
router.route('/price-types').post(priceType.create);
router.route('/price-types').put(priceType.update);
router.route('/price-types').patch(priceType.patch);
router.route('/price-types').delete(priceType.delete);
//#endregion

//#region ✅ Unit (단위)
const unit = new StdUnitCtl();
router.route('/units/excel-upload').post(unit.upsertBulkDatasFromExcel);
router.route('/unit/:uuid').get(unit.read);
router.route('/units').get(unit.read);
router.route('/units').post(unit.create);
router.route('/units').put(unit.update);
router.route('/units').patch(unit.patch);
router.route('/units').delete(unit.delete);
//#endregion

//#region ✅ UnitConvert (단위변환)
const unitConvert = new StdUnitConvertCtl();
router.route('/unit-converts/excel-upload').post(unitConvert.upsertBulkDatasFromExcel);
router.route('/unit-convert/:uuid').get(unitConvert.read);
router.route('/unit-converts').get(unitConvert.read);
router.route('/unit-converts').post(unitConvert.create);
router.route('/unit-converts').put(unitConvert.update);
router.route('/unit-converts').patch(unitConvert.patch);
router.route('/unit-converts').delete(unitConvert.delete);
//#endregion

//#region ✅ Routing (라우팅)
const routing = new StdRoutingCtl();
router.route('/routings/actived-prod').get(routing.readActivedProd);
router.route('/routing/:uuid').get(routing.read);
router.route('/routings').get(routing.read);
router.route('/routings').post(routing.create);
router.route('/routings').put(routing.update);
router.route('/routings').patch(routing.patch);
router.route('/routings').delete(routing.delete);
//#endregion

//#region ✅ Model (모델)
const model = new StdModelCtl();
router.route('/models/excel-upload').post(model.upsertBulkDatasFromExcel);
router.route('/model/:uuid').get(model.read);
router.route('/models').get(model.read);
router.route('/models').post(model.create);
router.route('/models').put(model.update);
router.route('/models').patch(model.patch);
router.route('/models').delete(model.delete);
//#endregion

//#region ✅ Dept (부서)
const dept = new StdDeptCtl();
router.route('/depts/excel-upload').post(dept.upsertBulkDatasFromExcel);
router.route('/dept/:uuid').get(dept.read);
router.route('/depts').get(dept.read);
router.route('/depts').post(dept.create);
router.route('/depts').put(dept.update);
router.route('/depts').patch(dept.patch);
router.route('/depts').delete(dept.delete);
//#endregion

//#region ✅ RejectType (부적합유형)
const rejectType = new StdRejectTypeCtl();
router.route('/reject-types/excel-upload').post(rejectType.upsertBulkDatasFromExcel);
router.route('/reject-type/:uuid').get(rejectType.read);
router.route('/reject-types').get(rejectType.read);
router.route('/reject-types').post(rejectType.create);
router.route('/reject-types').put(rejectType.update);
router.route('/reject-types').patch(rejectType.patch);
router.route('/reject-types').delete(rejectType.delete);
//#endregion

//#region ✅ Reject (부적합)
const reject = new StdRejectCtl();
router.route('/rejects/excel-upload').post(reject.upsertBulkDatasFromExcel);
router.route('/reject/:uuid').get(reject.read);
router.route('/rejects').get(reject.read);
router.route('/rejects').post(reject.create);
router.route('/rejects').put(reject.update);
router.route('/rejects').patch(reject.patch);
router.route('/rejects').delete(reject.delete);
//#endregion

//#region ✅ DowntimeType (비가동 유형)
const downtimeType = new StdDowntimeTypeCtl();
router.route('/downtime-types/excel-upload').post(downtimeType.upsertBulkDatasFromExcel);
router.route('/downtime-type/:uuid').get(downtimeType.read);
router.route('/downtime-types').get(downtimeType.read);
router.route('/downtime-types').post(downtimeType.create);
router.route('/downtime-types').put(downtimeType.update);
router.route('/downtime-types').patch(downtimeType.patch);
router.route('/downtime-types').delete(downtimeType.delete);
//#endregion

//#region ✅ Downtime (비가동)
const downtime = new StdDowntimeCtl();
router.route('/downtime/:uuid').get(stdDowntimeValidation.readByUuid, validationCallback, downtime.readByUuid);
router.route('/downtimes').get(stdDowntimeValidation.read, validationCallback, downtime.read);
router.route('/downtimes').post(stdDowntimeValidation.create, validationCallback, downtime.create);
router.route('/downtimes').put(stdDowntimeValidation.update, validationCallback, downtime.update);
router.route('/downtimes').patch(stdDowntimeValidation.patch, validationCallback, downtime.patch);
router.route('/downtimes').delete(stdDowntimeValidation.delete, validationCallback, downtime.delete);
//#endregion

//#region ✅ TenantOpt (사용자정의옵션)
const tenantOpt = new StdTenantOptCtl();
router.route('/tenant-opt/:uuid').get(stdTenantOptValidation.readByUuid, validationCallback, tenantOpt.readByUuid);
router.route('/tenant-opts').get(stdTenantOptValidation.read, validationCallback, tenantOpt.read);
router.route('/tenant-opts').post(stdTenantOptValidation.create, validationCallback, tenantOpt.create);
router.route('/tenant-opts').put(stdTenantOptValidation.update, validationCallback, tenantOpt.update);
router.route('/tenant-opts').patch(stdTenantOptValidation.patch, validationCallback, tenantOpt.patch);
router.route('/tenant-opts').delete(stdTenantOptValidation.delete, validationCallback, tenantOpt.delete);
//#endregion

//#region ✅ Emp (사원)
const emp = new StdEmpCtl();
router.route('/emps/excel-upload').post(emp.upsertBulkDatasFromExcel);
router.route('/emp/:uuid').get(emp.read);
router.route('/emps').get(emp.read);
router.route('/emps').post(emp.create);
router.route('/emps').put(emp.update);
router.route('/emps').patch(emp.patch);
router.route('/emps').delete(emp.delete);
//#endregion

//#region ✅ RoutingResource (생산 자원)
const routingResource = new StdRoutingResourceCtl();
router.route('/routing-resource/:uuid').get(stdRoutingResourceValidation.readByUuid, validationCallback, routingResource.readByUuid);
router.route('/routing-resources').get(stdRoutingResourceValidation.read, validationCallback, routingResource.read);
router.route('/routing-resources').post(stdRoutingResourceValidation.create, validationCallback, routingResource.create);
router.route('/routing-resources').put(stdRoutingResourceValidation.update, validationCallback, routingResource.update);
router.route('/routing-resources').patch(stdRoutingResourceValidation.patch, validationCallback, routingResource.patch);
router.route('/routing-resources').delete(stdRoutingResourceValidation.delete, validationCallback, routingResource.delete);
//#endregion

//#region ✅ EquipType (설비 유형)
const equipType = new StdEquipTypeCtl();
router.route('/equip-types/excel-upload').post(equipType.upsertBulkDatasFromExcel);
router.route('/equip-type/:uuid').get(equipType.read);
router.route('/equip-types').get(equipType.read);
router.route('/equip-types').post(equipType.create);
router.route('/equip-types').put(equipType.update);
router.route('/equip-types').patch(equipType.patch);
router.route('/equip-types').delete(equipType.delete);
//#endregion

//#region ✅ Equip (설비)
const equip = new StdEquipCtl();
// router.route('/equips/excel-upload').post(equip.upsertBulkDatasFromExcel);
router.route('/equip/:uuid').get(stdEquipValidation.readByUuid, validationCallback, equip.readByUuid);
router.route('/equips').get(stdEquipValidation.read, validationCallback, equip.read);
router.route('/equips').post(stdEquipValidation.create, validationCallback, equip.create);
router.route('/equips').put(stdEquipValidation.update, validationCallback, equip.update);
router.route('/equips').patch(stdEquipValidation.patch, validationCallback, equip.patch);
router.route('/equips').delete(stdEquipValidation.delete, validationCallback, equip.delete);
//#endregion

//#region ✅ Location (위치)
const location = new StdLocationCtl();
router.route('/locations/excel-upload').post(location.upsertBulkDatasFromExcel);
router.route('/location/:uuid').get(location.read);
router.route('/locations').get(location.read);
router.route('/locations').post(location.create);
router.route('/locations').put(location.update);
router.route('/locations').patch(location.patch);
router.route('/locations').delete(location.delete);
//#endregion

//#region ✅ Shift (작업교대)
const shift = new StdShiftCtl();
router.route('/shifts/excel-upload').post(shift.upsertBulkDatasFromExcel);
router.route('/shift/:uuid').get(shift.read);
router.route('/shifts').get(shift.read);
router.route('/shifts').post(shift.create);
router.route('/shifts').put(shift.update);
router.route('/shifts').patch(shift.patch);
router.route('/shifts').delete(shift.delete);
//#endregion

//#region ✅ Worker (작업자)
const worker = new StdWorkerCtl();
router.route('/workers/excel-upload').post(worker.upsertBulkDatasFromExcel);
router.route('/worker/:uuid').get(worker.read);
router.route('/workers').get(worker.read);
router.route('/workers').post(worker.create);
router.route('/workers').put(worker.update);
router.route('/workers').patch(worker.patch);
router.route('/workers').delete(worker.delete);
//#endregion

//#region ✅ Workings (작업장)
const workings = new StdWorkingsCtl();
router.route('/workingses/excel-upload').post(workings.upsertBulkDatasFromExcel);
router.route('/workings/:uuid').get(workings.read);
router.route('/workingses').get(workings.read);
router.route('/workingses').post(workings.create);
router.route('/workingses').put(workings.update);
router.route('/workingses').patch(workings.patch);
router.route('/workingses').delete(workings.delete);
//#endregion

//#region ✅ WorkerGroup (작업조)
const workerGroup = new StdWorkerGroupCtl();
router.route('/worker-groups/excel-upload').post(workerGroup.upsertBulkDatasFromExcel);
router.route('/worker-group/:uuid').get(workerGroup.read);
router.route('/worker-groups').get(workerGroup.read);
router.route('/worker-groups').post(workerGroup.create);
router.route('/worker-groups').put(workerGroup.update);
router.route('/worker-groups').patch(workerGroup.patch);
router.route('/worker-groups').delete(workerGroup.delete);
//#endregion

//#region ✅ WorkerGroupWorker (작업조-작업자)
const workerGroupWorker = new StdWorkerGroupWorkerCtl();
router.route('/worker-group-workers/excel-upload').post(workerGroupWorker.upsertBulkDatasFromExcel);
router.route('/worker-group-worker/:uuid').get(workerGroupWorker.read);
router.route('/worker-group-workers').get(workerGroupWorker.read);
router.route('/worker-group-workers').post(workerGroupWorker.create);
router.route('/worker-group-workers').put(workerGroupWorker.update);
router.route('/worker-group-workers').patch(workerGroupWorker.patch);
router.route('/worker-group-workers').delete(workerGroupWorker.delete);
//#endregion

//#region ✅ ProdType (제품유형)
const prodType = new StdProdTypeCtl();
router.route('/prod-types/excel-upload').post(prodType.upsertBulkDatasFromExcel);
router.route('/prod-type/:uuid').get(prodType.read);
router.route('/prod-types').get(prodType.read);
router.route('/prod-types').post(prodType.create);
router.route('/prod-types').put(prodType.update);
router.route('/prod-types').patch(prodType.patch);
router.route('/prod-types').delete(prodType.delete);
//#endregion

//#region ✅ Grade (직급)
const grade = new StdGradeCtl();
router.route('/grades/excel-upload').post(grade.upsertBulkDatasFromExcel);
router.route('/grade/:uuid').get(grade.read);
router.route('/grades').get(grade.read);
router.route('/grades').post(grade.create);
router.route('/grades').put(grade.update);
router.route('/grades').patch(grade.patch);
router.route('/grades').delete(grade.delete);
//#endregion

//#region ✅ Store (창고)
const store = new StdStoreCtl();
router.route('/stores/excel-upload').post(store.upsertBulkDatasFromExcel);
router.route('/store/:uuid').get(store.read);
router.route('/stores').get(store.read);
router.route('/stores').post(store.create);
router.route('/stores').put(store.update);
router.route('/stores').patch(store.patch);
router.route('/stores').delete(store.delete);
//#endregion

//#region ✅ RoutingWorkings (품목별 작업장)
const routingWorkings = new StdRoutingWorkingsCtl();
router.route('/routing-workings/:uuid').get(routingWorkings.read);
router.route('/routing-workingses').get(routingWorkings.read);
router.route('/routing-workingses').post(routingWorkings.create);
router.route('/routing-workingses').put(routingWorkings.update);
router.route('/routing-workingses').patch(routingWorkings.patch);
router.route('/routing-workingses').delete(routingWorkings.delete);
//#endregion

//#region ✅ ItemType (품목유형)
const itemType = new StdItemTypeCtl();
router.route('/item-types/excel-upload').post(itemType.upsertBulkDatasFromExcel);
router.route('/item-type/:uuid').get(itemType.read);
router.route('/item-types').get(itemType.read);
router.route('/item-types').post(itemType.create);
router.route('/item-types').put(itemType.update);
router.route('/item-types').patch(itemType.patch);
router.route('/item-types').delete(itemType.delete);
//#endregion

//#region ✅ Prod (품목)
const prod = new StdProdCtl();
router.route('/prods/excel-upload').post(prod.upsertBulkDatasFromExcel);
router.route('/prod/:uuid').get(prod.read);
router.route('/prods').get(prod.read);
router.route('/prods').post(prod.create);
router.route('/prods').put(prod.update);
router.route('/prods').patch(prod.patch);
router.route('/prods').delete(prod.delete);
//#endregion

//#region ✅ VendorPrice (협력사 단가)
const vendorPrice = new StdVendorPriceCtl();
router.route('/vendor-prices/excel-upload').post(vendorPrice.upsertBulkDatasFromExcel);
router.route('/vendor-price/:uuid').get(vendorPrice.read);
router.route('/vendor-prices').get(vendorPrice.read);
router.route('/vendor-prices').post(vendorPrice.create);
router.route('/vendor-prices').put(vendorPrice.update);
router.route('/vendor-prices').patch(vendorPrice.patch);
router.route('/vendor-prices').delete(vendorPrice.delete);
//#endregion

//#region ✅ MoneyUnit (화폐단위)
const moneyUnit = new StdMoneyUnitCtl();
router.route('/money-units/excel-upload').post(moneyUnit.upsertBulkDatasFromExcel);
router.route('/money-unit/:uuid').get(moneyUnit.read);
router.route('/money-units').get(moneyUnit.read);
router.route('/money-units').post(moneyUnit.create);
router.route('/money-units').put(moneyUnit.update);
router.route('/money-units').patch(moneyUnit.patch);
router.route('/money-units').delete(moneyUnit.delete);
//#endregion

//#region ✅ Company (회사)
const company = new StdCompanyCtl();
router.route('/companies/excel-upload').post(company.upsertBulkDatasFromExcel);
router.route('/company/:uuid').get(company.read);
router.route('/companies').get(company.read);
router.route('/companies').post(company.create);
router.route('/companies').put(company.update);
router.route('/companies').patch(company.patch);
router.route('/companies').delete(company.delete);
//#endregion

export default router;