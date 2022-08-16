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
import StdProcEquipCtl from '../controllers/std/proc-equip.controller';
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
import StdWorkerGroupEmpCtl from '../controllers/std/worker-group-emp.controller';
import StdWorkerGroupCtl from '../controllers/std/worker-group.controller';
import StdWorkingsCtl from '../controllers/std/workings.controller';
import StdDataMapCtl from '../controllers/std/data-map.controller';
import validationCallback from '../utils/validationCallback';

import stdBomValidation from '../validations/std/bom.validation';
import stdCompanyValidation from '../validations/std/company.validation';
import stdCustomerPriceValidation from '../validations/std/customer-price.validation';
import stdDeliveryValidation from '../validations/std/delivery.validation';
import stdDeptValidation from '../validations/std/dept.validation';
import stdDowntimeTypeValidation from '../validations/std/downtime-type.validation';
import stdDowntimeValidation from '../validations/std/downtime.validation';
import stdEmpValidation from '../validations/std/emp.validation';
import stdEquipTypeValidation from '../validations/std/equip-type.validation';
import stdEquipValidation from '../validations/std/equip.validation';
import stdFactoryValidation from '../validations/std/factory.validation';
import stdGradeValidation from '../validations/std/grade.validation';
import stdInspItemTypeValidation from '../validations/std/insp-item-type.validation';
import stdInspItemValidation from '../validations/std/insp-item.validation';
import stdInspMethodValidation from '../validations/std/insp-method.validation';
import stdInspToolValidation from '../validations/std/insp-tool.validation';
import stdItemTypeValidation from '../validations/std/item-type.validation';
import stdLocationValidation from '../validations/std/location.validation';
import stdModelValidation from '../validations/std/model.validation';
import stdMoneyUnitValidation from '../validations/std/money-unit.validation';
import stdPartnerProdValidation from '../validations/std/partner-prod.validation';
import stdPartnerTypeValidation from '../validations/std/partner-type.validation';
import stdPartnerValidation from '../validations/std/partner.validation';
import stdPriceTypeValidation from '../validations/std/price-type.validation';
import stdProcEquipValidation from '../validations/std/proc-equip.validation';
import stdProcRejectValidation from '../validations/std/proc-reject.validation';
import stdProcValidation from '../validations/std/proc.validation';
import stdProdTypeValidation from '../validations/std/prod-type.validation';
import stdProdValidation from '../validations/std/prod.validation';
import stdRejectTypeValidation from '../validations/std/reject-type.validation';
import stdRejectValidation from '../validations/std/reject.validation';
import stdRoutingResourceValidation from '../validations/std/routing-resource.validation';
import stdRoutingWorkingsValidation from '../validations/std/routing-workings.validation';
import stdRoutingValidation from '../validations/std/routing.validation';
import stdShiftValidation from '../validations/std/shift.validation';
import stdStoreValidation from '../validations/std/store.validation';
import stdSupplierValidation from '../validations/std/supplier.validation';
import stdTenantOptValidation from '../validations/std/tenant-opt.validation';
import stdUnitConvertValidation from '../validations/std/unit-convert.validation';
import stdUnitValidation from '../validations/std/unit.validation';
import stdVendorPriceValidation from '../validations/std/vendor-price.validation';
import stdWorkerGroupEmpValidation from '../validations/std/worker-group-emp.validation';
import stdWorkerGroupValidation from '../validations/std/worker-group.validation';
import stdWorkingsValidation from '../validations/std/workings.validation';
import StdBarcodeCtl from '../controllers/std/barcode.controller';
import stdBarcodeValidation from '../validations/std/barcode.validation';
import StdBarcodeHistoryCtl from '../controllers/std/barcode-history.controller';
import stdBarcodeHistoryValidation from '../validations/std/barcode-history.validation';
import StdWorktimeTypeCtl from '../controllers/std/worktime-type.controller';
import stdWorktimeTypeValidation from '../validations/std/worktime-type.validation';
import StdWorktimeCtl from '../controllers/std/worktime.controller';
import stdWorktimeValidation from '../validations/std/worktime.validation';
import StdWorkTypeCtl from '../controllers/std/work-type.controller';
import stdWorkTypeValidation from '../validations/std/work-type.validation';
import StdWorkCalendarCtl from '../controllers/std/work-calendar.controller';
import stdWorkCalendarValidation from '../validations/std/work-calendar.validation';

const router = express.Router();

//#region ✅ BOM (BOM)
const bom = new StdBomCtl();
router.route('/boms/trees').get(stdBomValidation.readToTrees, validationCallback, bom.readToTrees);
router.route('/bom/:uuid').get(stdBomValidation.readByUuid, validationCallback, bom.readByUuid);
router.route('/boms').get(stdBomValidation.read, validationCallback, bom.read);
router.route('/boms').post(stdBomValidation.create, validationCallback, bom.create);
router.route('/boms').put(stdBomValidation.update, validationCallback, bom.update);
router.route('/boms').patch(stdBomValidation.patch, validationCallback, bom.patch);
router.route('/boms').delete(stdBomValidation.delete, validationCallback, bom.delete);
//#endregion

//#region ✅ PartnerType (거래처 유형)
const partnerType = new StdPartnerTypeCtl();
// router.route('/partner-types/excel-upload').post(partnerType.upsertBulkDatasFromExcel);
router.route('/partner-type/:uuid').get(stdPartnerTypeValidation.readByUuid, validationCallback, partnerType.readByUuid);
router.route('/partner-types').get(stdPartnerTypeValidation.read, validationCallback, partnerType.read);
router.route('/partner-types').post(stdPartnerTypeValidation.create, validationCallback, partnerType.create);
router.route('/partner-types').put(stdPartnerTypeValidation.update, validationCallback, partnerType.update);
router.route('/partner-types').patch(stdPartnerTypeValidation.patch, validationCallback, partnerType.patch);
router.route('/partner-types').delete(stdPartnerTypeValidation.delete, validationCallback, partnerType.delete);
//#endregion

//#region ✅ Partner (거래처)
const partner = new StdPartnerCtl();
// router.route('/partners/excel-upload').post(partner.upsertBulkDatasFromExcel);
router.route('/partners/excel-validation').post(partner.excelValidation);
router.route('/partner/:uuid').get(stdPartnerValidation.readByUuid, validationCallback, partner.readByUuid);
router.route('/partners').get(stdPartnerValidation.read, validationCallback, partner.read);
router.route('/partners').post(stdPartnerValidation.create, validationCallback, partner.create);
router.route('/partners').put(stdPartnerValidation.update, validationCallback, partner.update);
router.route('/partners').patch(stdPartnerValidation.patch, validationCallback, partner.patch);
router.route('/partners').delete(stdPartnerValidation.delete, validationCallback, partner.delete);
//#endregion

//#region ✅ PartnerProd (거래처 품목)
const partnerProd = new StdPartnerProdCtl();
// router.route('/partner-prods/excel-upload').post(partnerProd.upsertBulkDatasFromExcel);
router.route('/partner-prod/:uuid').get(stdPartnerProdValidation.readByUuid, validationCallback, partnerProd.readByUuid);
router.route('/partner-prods').get(stdPartnerProdValidation.read, validationCallback, partnerProd.read);
router.route('/partner-prods').post(stdPartnerProdValidation.create, validationCallback, partnerProd.create);
router.route('/partner-prods').put(stdPartnerProdValidation.update, validationCallback, partnerProd.update);
router.route('/partner-prods').patch(stdPartnerProdValidation.patch, validationCallback, partnerProd.patch);
router.route('/partner-prods').delete(stdPartnerProdValidation.delete, validationCallback, partnerProd.delete);
//#endregion

//#region ✅ InspTool (검사구)
const inspTool = new StdInspToolCtl();
// router.route('/insp-tools/excel-upload').post(inspTool.upsertBulkDatasFromExcel);
router.route('/insp-tool/:uuid').get(stdInspToolValidation.readByUuid, validationCallback, inspTool.readByUuid);
router.route('/insp-tools').get(stdInspToolValidation.read, validationCallback, inspTool.read);
router.route('/insp-tools').post(stdInspToolValidation.create, validationCallback, inspTool.create);
router.route('/insp-tools').put(stdInspToolValidation.update, validationCallback, inspTool.update);
router.route('/insp-tools').patch(stdInspToolValidation.patch, validationCallback, inspTool.patch);
router.route('/insp-tools').delete(stdInspToolValidation.delete, validationCallback, inspTool.delete);
//#endregion

//#region ✅ InspMethod (검사방법)
const inspMethod = new StdInspMethodCtl();
// router.route('/insp-methods/excel-upload').post(inspMethod.upsertBulkDatasFromExcel);
router.route('/insp-method/:uuid').get(stdInspMethodValidation.readByUuid, validationCallback, inspMethod.readByUuid);
router.route('/insp-methods').get(stdInspMethodValidation.read, validationCallback, inspMethod.read);
router.route('/insp-methods').post(stdInspMethodValidation.create, validationCallback, inspMethod.create);
router.route('/insp-methods').put(stdInspMethodValidation.update, validationCallback, inspMethod.update);
router.route('/insp-methods').patch(stdInspMethodValidation.patch, validationCallback, inspMethod.patch);
router.route('/insp-methods').delete(stdInspMethodValidation.delete, validationCallback, inspMethod.delete);
//#endregion

//#region ✅ InspItemType (검사항목 유형)
const inspItemType = new StdInspItemTypeCtl();
// router.route('/insp-item-types/excel-upload').post(inspItemType.upsertBulkDatasFromExcel);
router.route('/insp-item-type/:uuid').get(stdInspItemTypeValidation.readByUuid, validationCallback, inspItemType.readByUuid);
router.route('/insp-item-types').get(stdInspItemTypeValidation.read, validationCallback, inspItemType.read);
router.route('/insp-item-types').post(stdInspItemTypeValidation.create, validationCallback, inspItemType.create);
router.route('/insp-item-types').put(stdInspItemTypeValidation.update, validationCallback, inspItemType.update);
router.route('/insp-item-types').patch(stdInspItemTypeValidation.patch, validationCallback, inspItemType.patch);
router.route('/insp-item-types').delete(stdInspItemTypeValidation.delete, validationCallback, inspItemType.delete);
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
// router.route('/customer-prices/excel-upload').post(customerPrice.upsertBulkDatasFromExcel);
router.route('/customer-price/:uuid').get(stdCustomerPriceValidation.readByUuid, validationCallback, customerPrice.readByUuid);
router.route('/customer-prices').get(stdCustomerPriceValidation.read, validationCallback, customerPrice.read);
router.route('/customer-prices').post(stdCustomerPriceValidation.create, validationCallback, customerPrice.create);
router.route('/customer-prices').put(stdCustomerPriceValidation.update, validationCallback, customerPrice.update);
router.route('/customer-prices').patch(stdCustomerPriceValidation.patch, validationCallback, customerPrice.patch);
router.route('/customer-prices').delete(stdCustomerPriceValidation.delete, validationCallback, customerPrice.delete);
//#endregion

//#region ✅ Supplier (공급처)
const supplier = new StdSupplierCtl();
// router.route('/suppliers/excel-upload').post(supplier.upsertBulkDatasFromExcel);
router.route('/supplier/:uuid').get(stdSupplierValidation.readByUuid, validationCallback, supplier.readByUuid);
router.route('/suppliers').get(stdSupplierValidation.read, validationCallback, supplier.read);
router.route('/suppliers').post(stdSupplierValidation.create, validationCallback, supplier.create);
router.route('/suppliers').put(stdSupplierValidation.update, validationCallback, supplier.update);
router.route('/suppliers').patch(stdSupplierValidation.patch, validationCallback, supplier.patch);
router.route('/suppliers').delete(stdSupplierValidation.delete, validationCallback, supplier.delete);
//#endregion

//#region ✅ Factory (공장)
const factory = new StdFactoryCtl();
// router.route('/factories/excel-upload').post(factory.upsertBulkDatasFromExcel);
router.route('/factory/:uuid').get(stdFactoryValidation.readByUuid, validationCallback, factory.readByUuid);
router.route('/factories/sign-in').get(factory.readForSignIn);
router.route('/factories').get(stdFactoryValidation.read, validationCallback, factory.read);
router.route('/factories').post(stdFactoryValidation.create, validationCallback, factory.create);
router.route('/factories').put(stdFactoryValidation.update, validationCallback, factory.update);
router.route('/factories').patch(stdFactoryValidation.patch, validationCallback, factory.patch);
router.route('/factories').delete(stdFactoryValidation.delete, validationCallback, factory.delete);
//#endregion

//#region ✅ Proc (공정)
const proc = new StdProcCtl();
// router.route('/procs/excel-upload').post(proc.upsertBulkDatasFromExcel);
router.route('/proc/:uuid').get(stdProcValidation.readByUuid, validationCallback, proc.readByUuid);
router.route('/procs').get(stdProcValidation.read, validationCallback, proc.read);
router.route('/procs').post(stdProcValidation.create, validationCallback, proc.create);
router.route('/procs').put(stdProcValidation.update, validationCallback, proc.update);
router.route('/procs').patch(stdProcValidation.patch, validationCallback, proc.patch);
router.route('/procs').delete(stdProcValidation.delete, validationCallback, proc.delete);
//#endregion

//#region ✅ ProcEquip (공정별 설비정보)
const procEquip = new StdProcEquipCtl();
router.route('/proc-equip/:uuid').get(stdProcEquipValidation.readByUuid, validationCallback, procEquip.readByUuid);
router.route('/proc-equips').get(stdProcEquipValidation.read, validationCallback, procEquip.read);
router.route('/proc-equips').post(stdProcEquipValidation.create, validationCallback, procEquip.create);
router.route('/proc-equips').put(stdProcEquipValidation.update, validationCallback, procEquip.update);
router.route('/proc-equips').patch(stdProcEquipValidation.patch, validationCallback, procEquip.patch);
router.route('/proc-equips').delete(stdProcEquipValidation.delete, validationCallback, procEquip.delete);
//#endregion

//#region ✅ ProcReject (공정별 부적합)
const procReject = new StdProcRejectCtl();
// router.route('/proc-rejects/excel-upload').post(procReject.upsertBulkDatasFromExcel);
router.route('/proc-reject/:uuid').get(stdProcRejectValidation.readByUuid, validationCallback, procReject.readByUuid);
router.route('/proc-rejects').get(stdProcRejectValidation.read, validationCallback, procReject.read);
router.route('/proc-rejects').post(stdProcRejectValidation.create, validationCallback, procReject.create);
router.route('/proc-rejects').put(stdProcRejectValidation.update, validationCallback, procReject.update);
router.route('/proc-rejects').patch(stdProcRejectValidation.patch, validationCallback, procReject.patch);
router.route('/proc-rejects').delete(stdProcRejectValidation.delete, validationCallback, procReject.delete);
//#endregion

//#region ✅ Delivery (납품처)
const delivery = new StdDeliveryCtl();
// router.route('/deliveries/excel-upload').post(delivery.upsertBulkDatasFromExcel);
router.route('/delivery/:uuid').get(stdDeliveryValidation.readByUuid, validationCallback, delivery.readByUuid);
router.route('/deliveries').get(stdDeliveryValidation.read, validationCallback, delivery.read);
router.route('/deliveries').post(stdDeliveryValidation.create, validationCallback, delivery.create);
router.route('/deliveries').put(stdDeliveryValidation.update, validationCallback, delivery.update);
router.route('/deliveries').patch(stdDeliveryValidation.patch, validationCallback, delivery.patch);
router.route('/deliveries').delete(stdDeliveryValidation.delete, validationCallback, delivery.delete);
//#endregion

//#region ✅ PriceType (단가유형)
const priceType = new StdPriceTypeCtl();
// router.route('/price-types/excel-upload').post(priceType.upsertBulkDatasFromExcel);
router.route('/price-type/:uuid').get(stdPriceTypeValidation.readByUuid, validationCallback, priceType.readByUuid);
router.route('/price-types').get(stdPriceTypeValidation.read, validationCallback, priceType.read);
router.route('/price-types').post(stdPriceTypeValidation.create, validationCallback, priceType.create);
router.route('/price-types').put(stdPriceTypeValidation.update, validationCallback, priceType.update);
router.route('/price-types').patch(stdPriceTypeValidation.patch, validationCallback, priceType.patch);
router.route('/price-types').delete(stdPriceTypeValidation.delete, validationCallback, priceType.delete);
//#endregion

//#region ✅ Unit (단위)
const unit = new StdUnitCtl();
// router.route('/units/excel-upload').post(unit.upsertBulkDatasFromExcel);
router.route('/unit/:uuid').get(stdUnitValidation.readByUuid, validationCallback, unit.readByUuid);
router.route('/units').get(stdUnitValidation.read, validationCallback, unit.read);
router.route('/units').post(stdUnitValidation.create, validationCallback, unit.create);
router.route('/units').put(stdUnitValidation.update, validationCallback, unit.update);
router.route('/units').patch(stdUnitValidation.patch, validationCallback, unit.patch);
router.route('/units').delete(stdUnitValidation.delete, validationCallback, unit.delete);
//#endregion

//#region ✅ UnitConvert (단위변환)
const unitConvert = new StdUnitConvertCtl();
// router.route('/unit-converts/excel-upload').post(unitConvert.upsertBulkDatasFromExcel);
router.route('/unit-convert/:uuid').get(stdUnitConvertValidation.readByUuid, validationCallback, unitConvert.readByUuid);
router.route('/unit-converts').get(stdUnitConvertValidation.read, validationCallback, unitConvert.read);
router.route('/unit-converts').post(stdUnitConvertValidation.create, validationCallback, unitConvert.create);
router.route('/unit-converts').put(stdUnitConvertValidation.update, validationCallback, unitConvert.update);
router.route('/unit-converts').patch(stdUnitConvertValidation.patch, validationCallback, unitConvert.patch);
router.route('/unit-converts').delete(stdUnitConvertValidation.delete, validationCallback, unitConvert.delete);
//#endregion

//#region ✅ Routing (라우팅)
const routing = new StdRoutingCtl();
router.route('/routings/actived-prod').get(stdRoutingValidation.readActivedProd, validationCallback, routing.readActivedProd);
router.route('/routing/:uuid').get(stdRoutingValidation.readByUuid, validationCallback, routing.readByUuid);
router.route('/routings').get(stdRoutingValidation.read, validationCallback, routing.read);
router.route('/routings').post(stdRoutingValidation.create, validationCallback, routing.create);
router.route('/routings').put(stdRoutingValidation.update, validationCallback, routing.update);
router.route('/routings').patch(stdRoutingValidation.patch, validationCallback, routing.patch);
router.route('/routings').delete(stdRoutingValidation.delete, validationCallback, routing.delete);
//#endregion

//#region ✅ Model (모델)
const model = new StdModelCtl();
// router.route('/models/excel-upload').post(model.upsertBulkDatasFromExcel);
router.route('/model/:uuid').get(stdModelValidation.readByUuid, validationCallback, model.readByUuid);
router.route('/models').get(stdModelValidation.read, validationCallback, model.read);
router.route('/models').post(stdModelValidation.create, validationCallback, model.create);
router.route('/models').put(stdModelValidation.update, validationCallback, model.update);
router.route('/models').patch(stdModelValidation.patch, validationCallback, model.patch);
router.route('/models').delete(stdModelValidation.delete, validationCallback, model.delete);
//#endregion

//#region ✅ Dept (부서)
const dept = new StdDeptCtl();
// router.route('/depts/excel-upload').post(dept.upsertBulkDatasFromExcel);
router.route('/dept/:uuid').get(stdDeptValidation.readByUuid, validationCallback, dept.readByUuid);
router.route('/depts').get(stdDeptValidation.read, validationCallback, dept.read);
router.route('/depts').post(stdDeptValidation.create, validationCallback, dept.create);
router.route('/depts').put(stdDeptValidation.update, validationCallback, dept.update);
router.route('/depts').patch(stdDeptValidation.patch, validationCallback, dept.patch);
router.route('/depts').delete(stdDeptValidation.delete, validationCallback, dept.delete);
//#endregion

//#region ✅ RejectType (부적합유형)
const rejectType = new StdRejectTypeCtl();
// router.route('/reject-types/excel-upload').post(rejectType.upsertBulkDatasFromExcel);
router.route('/reject-type/:uuid').get(stdRejectTypeValidation.readByUuid, validationCallback, rejectType.readByUuid);
router.route('/reject-types').get(stdRejectTypeValidation.read, validationCallback, rejectType.read);
router.route('/reject-types').post(stdRejectTypeValidation.create, validationCallback, rejectType.create);
router.route('/reject-types').put(stdRejectTypeValidation.update, validationCallback, rejectType.update);
router.route('/reject-types').patch(stdRejectTypeValidation.patch, validationCallback, rejectType.patch);
router.route('/reject-types').delete(stdRejectTypeValidation.delete, validationCallback, rejectType.delete);
//#endregion

//#region ✅ Reject (부적합)
const reject = new StdRejectCtl();
// router.route('/rejects/excel-upload').post(reject.upsertBulkDatasFromExcel);
router.route('/reject/:uuid').get(stdRejectValidation.readByUuid, validationCallback, reject.readByUuid);
router.route('/rejects').get(stdRejectValidation.read, validationCallback, reject.read);
router.route('/rejects').post(stdRejectValidation.create, validationCallback, reject.create);
router.route('/rejects').put(stdRejectValidation.update, validationCallback, reject.update);
router.route('/rejects').patch(stdRejectValidation.patch, validationCallback, reject.patch);
router.route('/rejects').delete(stdRejectValidation.delete, validationCallback, reject.delete);
//#endregion

//#region ✅ DowntimeType (비가동 유형)
const downtimeType = new StdDowntimeTypeCtl();
// router.route('/downtime-types/excel-upload').post(downtimeType.upsertBulkDatasFromExcel);
router.route('/downtime-type/:uuid').get(stdDowntimeTypeValidation.readByUuid, validationCallback, downtimeType.readByUuid);
router.route('/downtime-types').get(stdDowntimeTypeValidation.read, validationCallback, downtimeType.read);
router.route('/downtime-types').post(stdDowntimeTypeValidation.create, validationCallback, downtimeType.create);
router.route('/downtime-types').put(stdDowntimeTypeValidation.update, validationCallback, downtimeType.update);
router.route('/downtime-types').patch(stdDowntimeTypeValidation.patch, validationCallback, downtimeType.patch);
router.route('/downtime-types').delete(stdDowntimeTypeValidation.delete, validationCallback, downtimeType.delete);
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
// router.route('/emps/excel-upload').post(emp.upsertBulkDatasFromExcel);
router.route('/emps/by-workings').get(stdEmpValidation.readByWorkings, validationCallback, emp.readByWorkings);
router.route('/emp/:uuid').get(stdEmpValidation.readByUuid, validationCallback, emp.readByUuid);
router.route('/emps').get(stdEmpValidation.read, validationCallback, emp.read);
router.route('/emps').post(stdEmpValidation.create, validationCallback, emp.create);
router.route('/emps').put(stdEmpValidation.update, validationCallback, emp.update);
router.route('/emps').patch(stdEmpValidation.patch, validationCallback, emp.patch);
router.route('/emps').delete(stdEmpValidation.delete, validationCallback, emp.delete);
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
// router.route('/equip-types/excel-upload').post(equipType.upsertBulkDatasFromExcel);
router.route('/equip-type/:uuid').get(stdEquipTypeValidation.readByUuid, validationCallback, equipType.readByUuid);
router.route('/equip-types').get(stdEquipTypeValidation.read, validationCallback, equipType.read);
router.route('/equip-types').post(stdEquipTypeValidation.create, validationCallback, equipType.create);
router.route('/equip-types').put(stdEquipTypeValidation.update, validationCallback, equipType.update);
router.route('/equip-types').patch(stdEquipTypeValidation.patch, validationCallback, equipType.patch);
router.route('/equip-types').delete(stdEquipTypeValidation.delete, validationCallback, equipType.delete);
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
// router.route('/locations/excel-upload').post(location.upsertBulkDatasFromExcel);
router.route('/location/:uuid').get(stdLocationValidation.readByUuid, validationCallback, location.readByUuid);
router.route('/locations').get(stdLocationValidation.read, validationCallback, location.read);
router.route('/locations').post(stdLocationValidation.create, validationCallback, location.create);
router.route('/locations').put(stdLocationValidation.update, validationCallback, location.update);
router.route('/locations').patch(stdLocationValidation.patch, validationCallback, location.patch);
router.route('/locations').delete(stdLocationValidation.delete, validationCallback, location.delete);
//#endregion

//#region ✅ Shift (작업교대)
const shift = new StdShiftCtl();
// router.route('/shifts/excel-upload').post(shift.upsertBulkDatasFromExcel);
router.route('/shift/:uuid').get(stdShiftValidation.readByUuid, validationCallback, shift.readByUuid);
router.route('/shifts').get(stdShiftValidation.read, validationCallback, shift.read);
router.route('/shifts').post(stdShiftValidation.create, validationCallback, shift.create);
router.route('/shifts').put(stdShiftValidation.update, validationCallback, shift.update);
router.route('/shifts').patch(stdShiftValidation.patch, validationCallback, shift.patch);
router.route('/shifts').delete(stdShiftValidation.delete, validationCallback, shift.delete);
//#endregion

//#region ✅ Workings (작업장)
const workings = new StdWorkingsCtl();
// router.route('/workingses/excel-upload').post(workings.upsertBulkDatasFromExcel);
router.route('/workings/:uuid').get(stdWorkingsValidation.readByUuid, validationCallback, workings.readByUuid);
router.route('/workingses').get(stdWorkingsValidation.read, validationCallback, workings.read);
router.route('/workingses').post(stdWorkingsValidation.create, validationCallback, workings.create);
router.route('/workingses').put(stdWorkingsValidation.update, validationCallback, workings.update);
router.route('/workingses').patch(stdWorkingsValidation.patch, validationCallback, workings.patch);
router.route('/workingses').delete(stdWorkingsValidation.delete, validationCallback, workings.delete);
//#endregion

//#region ✅ WorkerGroup (작업조)
const workerGroup = new StdWorkerGroupCtl();
// router.route('/worker-groups/excel-upload').post(workerGroup.upsertBulkDatasFromExcel);
router.route('/worker-group/:uuid').get(stdWorkerGroupValidation.readByUuid, validationCallback, workerGroup.readByUuid);
router.route('/worker-groups').get(stdWorkerGroupValidation.read, validationCallback, workerGroup.read);
router.route('/worker-groups').post(stdWorkerGroupValidation.create, validationCallback, workerGroup.create);
router.route('/worker-groups').put(stdWorkerGroupValidation.update, validationCallback, workerGroup.update);
router.route('/worker-groups').patch(stdWorkerGroupValidation.patch, validationCallback, workerGroup.patch);
router.route('/worker-groups').delete(stdWorkerGroupValidation.delete, validationCallback, workerGroup.delete);
//#endregion

//#region ✅ WorkerGroupEmp (작업조-작업자)
const workerGroupEmp = new StdWorkerGroupEmpCtl();
// router.route('/worker-group-emps/excel-upload').post(workerGroupEmp.upsertBulkDatasFromExcel);
router.route('/worker-group-worker/:uuid').get(stdWorkerGroupEmpValidation.readByUuid, validationCallback, workerGroupEmp.readByUuid);
router.route('/worker-group-emps').get(stdWorkerGroupEmpValidation.read, validationCallback, workerGroupEmp.read);
router.route('/worker-group-emps').post(stdWorkerGroupEmpValidation.create, validationCallback, workerGroupEmp.create);
router.route('/worker-group-emps').put(stdWorkerGroupEmpValidation.update, validationCallback, workerGroupEmp.update);
router.route('/worker-group-emps').patch(stdWorkerGroupEmpValidation.patch, validationCallback, workerGroupEmp.patch);
router.route('/worker-group-emps').delete(stdWorkerGroupEmpValidation.delete, validationCallback, workerGroupEmp.delete);
//#endregion

//#region ✅ ProdType (제품유형)
const prodType = new StdProdTypeCtl();
// router.route('/prod-types/excel-upload').post(prodType.upsertBulkDatasFromExcel);
router.route('/prod-type/:uuid').get(stdProdTypeValidation.readByUuid, validationCallback, prodType.readByUuid);
router.route('/prod-types').get(stdProdTypeValidation.read, validationCallback, prodType.read);
router.route('/prod-types').post(stdProdTypeValidation.create, validationCallback, prodType.create);
router.route('/prod-types').put(stdProdTypeValidation.update, validationCallback, prodType.update);
router.route('/prod-types').patch(stdProdTypeValidation.patch, validationCallback, prodType.patch);
router.route('/prod-types').delete(stdProdTypeValidation.delete, validationCallback, prodType.delete);
//#endregion

//#region ✅ Grade (직급)
const grade = new StdGradeCtl();
// router.route('/grades/excel-upload').post(grade.upsertBulkDatasFromExcel);
router.route('/grade/:uuid').get(stdGradeValidation.readByUuid, validationCallback, grade.readByUuid);
router.route('/grades').get(stdGradeValidation.read, validationCallback, grade.read);
router.route('/grades').post(stdGradeValidation.create, validationCallback, grade.create);
router.route('/grades').put(stdGradeValidation.update, validationCallback, grade.update);
router.route('/grades').patch(stdGradeValidation.patch, validationCallback, grade.patch);
router.route('/grades').delete(stdGradeValidation.delete, validationCallback, grade.delete);
//#endregion

//#region ✅ Store (창고)
const store = new StdStoreCtl();
// router.route('/stores/excel-upload').post(store.upsertBulkDatasFromExcel);
router.route('/store/:uuid').get(stdStoreValidation.readByUuid, validationCallback, store.readByUuid);
router.route('/stores').get(stdStoreValidation.read, validationCallback, store.read);
router.route('/stores').post(stdStoreValidation.create, validationCallback, store.create);
router.route('/stores').put(stdStoreValidation.update, validationCallback, store.update);
router.route('/stores').patch(stdStoreValidation.patch, validationCallback, store.patch);
router.route('/stores').delete(stdStoreValidation.delete, validationCallback, store.delete);
//#endregion

//#region ✅ RoutingWorkings (품목별 작업장)
const routingWorkings = new StdRoutingWorkingsCtl();
router.route('/routing-workings/:uuid').get(stdRoutingWorkingsValidation.readByUuid, validationCallback, routingWorkings.readByUuid);
router.route('/routing-workingses').get(stdRoutingWorkingsValidation.read, validationCallback, routingWorkings.read);
router.route('/routing-workingses').post(stdRoutingWorkingsValidation.create, validationCallback, routingWorkings.create);
router.route('/routing-workingses').put(stdRoutingWorkingsValidation.update, validationCallback, routingWorkings.update);
router.route('/routing-workingses').patch(stdRoutingWorkingsValidation.patch, validationCallback, routingWorkings.patch);
router.route('/routing-workingses').delete(stdRoutingWorkingsValidation.delete, validationCallback, routingWorkings.delete);
//#endregion

//#region ✅ ItemType (품목유형)
const itemType = new StdItemTypeCtl();
// router.route('/item-types/excel-upload').post(itemType.upsertBulkDatasFromExcel);
router.route('/item-type/:uuid').get(stdItemTypeValidation.readByUuid, validationCallback, itemType.readByUuid);
router.route('/item-types').get(stdItemTypeValidation.read, validationCallback, itemType.read);
router.route('/item-types').post(stdItemTypeValidation.create, validationCallback, itemType.create);
router.route('/item-types').put(stdItemTypeValidation.update, validationCallback, itemType.update);
router.route('/item-types').patch(stdItemTypeValidation.patch, validationCallback, itemType.patch);
router.route('/item-types').delete(stdItemTypeValidation.delete, validationCallback, itemType.delete);
//#endregion

//#region ✅ Prod (품목)
const prod = new StdProdCtl();
// router.route('/prods/excel-upload').post(prod.upsertBulkDatasFromExcel);
router.route('/prod/:uuid').get(stdProdValidation.readByUuid, validationCallback, prod.readByUuid);
router.route('/prods').get(stdProdValidation.read, validationCallback, prod.read);
router.route('/prods').post(stdProdValidation.create, validationCallback, prod.create);
router.route('/prods').put(stdProdValidation.update, validationCallback, prod.update);
router.route('/prods').patch(stdProdValidation.patch, validationCallback, prod.patch);
router.route('/prods').delete(stdProdValidation.delete, validationCallback, prod.delete);
//#endregion

//#region ✅ VendorPrice (협력사 단가)
const vendorPrice = new StdVendorPriceCtl();
// router.route('/vendor-prices/excel-upload').post(vendorPrice.upsertBulkDatasFromExcel);
router.route('/vendor-price/:uuid').get(stdVendorPriceValidation.readByUuid, validationCallback, vendorPrice.readByUuid);
router.route('/vendor-prices').get(stdVendorPriceValidation.read, validationCallback, vendorPrice.read);
router.route('/vendor-prices').post(stdVendorPriceValidation.create, validationCallback, vendorPrice.create);
router.route('/vendor-prices').put(stdVendorPriceValidation.update, validationCallback, vendorPrice.update);
router.route('/vendor-prices').patch(stdVendorPriceValidation.patch, validationCallback, vendorPrice.patch);
router.route('/vendor-prices').delete(stdVendorPriceValidation.delete, validationCallback, vendorPrice.delete);
//#endregion

//#region ✅ MoneyUnit (화폐단위)
const moneyUnit = new StdMoneyUnitCtl();
// router.route('/money-units/excel-upload').post(moneyUnit.upsertBulkDatasFromExcel);
router.route('/money-unit/:uuid').get(stdMoneyUnitValidation.readByUuid, validationCallback, moneyUnit.readByUuid);
router.route('/money-units').get(stdMoneyUnitValidation.read, validationCallback, moneyUnit.read);
router.route('/money-units').post(stdMoneyUnitValidation.create, validationCallback, moneyUnit.create);
router.route('/money-units').put(stdMoneyUnitValidation.update, validationCallback, moneyUnit.update);
router.route('/money-units').patch(stdMoneyUnitValidation.patch, validationCallback, moneyUnit.patch);
router.route('/money-units').delete(stdMoneyUnitValidation.delete, validationCallback, moneyUnit.delete);
//#endregion

//#region ✅ Company (회사)
const company = new StdCompanyCtl();
// router.route('/companies/excel-upload').post(company.upsertBulkDatasFromExcel);
router.route('/company/:uuid').get(stdCompanyValidation.readByUuid, validationCallback, company.readByUuid);
router.route('/companies').get(stdCompanyValidation.read, validationCallback, company.read);
router.route('/companies').post(stdCompanyValidation.create, validationCallback, company.create);
router.route('/companies').put(stdCompanyValidation.update, validationCallback, company.update);
router.route('/companies').patch(stdCompanyValidation.patch, validationCallback, company.patch);
router.route('/companies').delete(stdCompanyValidation.delete, validationCallback, company.delete);
//#endregion

//#region ✅ dataMap (인터페이스 설비)
const dataMap = new StdDataMapCtl();
router.route('/data-map/report').get(dataMap.readInterfaceMonitoring);
//#endregion

//#region ✅ barcode (바코드)
const barcode = new StdBarcodeCtl();
router.route('/barcode/:uuid').get(stdBarcodeValidation.readByUuid, validationCallback, barcode.readByUuid);
router.route('/barcodes').get(stdBarcodeValidation.read, validationCallback, barcode.read);
router.route('/barcodes').post(stdBarcodeValidation.create, validationCallback, barcode.create);
router.route('/barcodes').put(stdBarcodeValidation.update, validationCallback, barcode.update);
router.route('/barcodes').patch(stdBarcodeValidation.patch, validationCallback, barcode.patch);
router.route('/barcodes').delete(stdBarcodeValidation.delete, validationCallback, barcode.delete);
//#endregion

//#region ✅ barcode-history (바코드 이력)
const barcodeHistory = new StdBarcodeHistoryCtl();
router.route('/barcode-history/:uuid').get(stdBarcodeHistoryValidation.readByUuid, validationCallback, barcodeHistory.readByUuid);
router.route('/barcode-histories').get(stdBarcodeHistoryValidation.read, validationCallback, barcodeHistory.read);
router.route('/barcode-histories').post(stdBarcodeHistoryValidation.create, validationCallback, barcodeHistory.create);
router.route('/barcode-histories').delete(stdBarcodeHistoryValidation.delete, validationCallback, barcodeHistory.delete);
//#endregion

//#region ✅ worktime-type (근무시간유형)
const worktimeType = new StdWorktimeTypeCtl();
router.route('/worktime-type/:uuid').get(stdWorktimeTypeValidation.readByUuid, validationCallback, worktimeType.readByUuid);
router.route('/worktime-types').get(stdWorktimeTypeValidation.read, validationCallback, worktimeType.read);
router.route('/worktime-types').post(stdWorktimeTypeValidation.create, validationCallback, worktimeType.create);
router.route('/worktime-types').put(stdWorktimeTypeValidation.update, validationCallback, worktimeType.update);
router.route('/worktime-types').patch(stdWorktimeTypeValidation.patch, validationCallback, worktimeType.patch);
router.route('/worktime-types').delete(stdWorktimeTypeValidation.delete, validationCallback, worktimeType.delete);
//#endregion

//#region ✅ work-type (근무유형)
const workType = new StdWorkTypeCtl();
router.route('/work-type/:uuid').get(stdWorkTypeValidation.readByUuid, validationCallback, workType.readByUuid);
router.route('/work-types').get(stdWorkTypeValidation.read, validationCallback, workType.read);
router.route('/work-types').post(stdWorkTypeValidation.create, validationCallback, workType.create);
router.route('/work-types').put(stdWorkTypeValidation.update, validationCallback, workType.update);
router.route('/work-types').patch(stdWorkTypeValidation.patch, validationCallback, workType.patch);
router.route('/work-types').delete(stdWorkTypeValidation.delete, validationCallback, workType.delete);
//#endregion

//#region ✅ worktime (근무시간)
const worktime = new StdWorktimeCtl();
router.route('/worktime/:uuid').get(stdWorktimeValidation.readByUuid, validationCallback, worktime.readByUuid);
router.route('/worktimes').get(stdWorktimeValidation.read, validationCallback, worktime.read);
router.route('/worktimes').post(stdWorktimeValidation.create, validationCallback, worktime.create);
router.route('/worktimes').put(stdWorktimeValidation.update, validationCallback, worktime.update);
router.route('/worktimes').patch(stdWorktimeValidation.patch, validationCallback, worktime.patch);
router.route('/worktimes').delete(stdWorktimeValidation.delete, validationCallback, worktime.delete);
router.route('/worktimes/work-hours').get(stdWorktimeValidation.workHours, validationCallback, worktime.workHours);
//#endregion

//#region ✅ work-calendar (근무 일정)
const workCalendar = new StdWorkCalendarCtl();
router.route('/work-calendar/:uuid').get(stdWorkCalendarValidation.readByUuid, validationCallback, workCalendar.readByUuid);
router.route('/work-calendars').get(stdWorkCalendarValidation.read, validationCallback, workCalendar.read);
router.route('/work-calendars').post(stdWorkCalendarValidation.create, validationCallback, workCalendar.create);
router.route('/work-calendars').put(stdWorkCalendarValidation.update, validationCallback, workCalendar.update);
router.route('/work-calendars').patch(stdWorkCalendarValidation.patch, validationCallback, workCalendar.patch);
router.route('/work-calendars').delete(stdWorkCalendarValidation.delete, validationCallback, workCalendar.delete);
//#endregion

export default router;