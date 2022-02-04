import * as express from 'express';

import SalReturnCtl from '../controllers/sal/return.controller';
import SalReturnDetailCtl from '../controllers/sal/return-detail.controller';
import SalOrderCtl from '../controllers/sal/order.controller';
import SalOrderDetailCtl from '../controllers/sal/order-detail.controller';
import SalIncomeCtl from '../controllers/sal/income.controller';
import SalReleaseCtl from '../controllers/sal/release.controller';
import SalOutgoOrderCtl from '../controllers/sal/outgo-order.controller';
import SalOutgoOrderDetailCtl from '../controllers/sal/outgo-order-detail.controller';
import SalOutgoCtl from '../controllers/sal/outgo.controller';
import SalOutgoDetailCtl from '../controllers/sal/outgo-detail.controller';
import salIncomeValidation from '../validations/sal/income.validation';
import validationCallback from '../utils/validationCallback';
import salOutgoValidation from '../validations/sal/outgo.validation';
import salOutgoDetailValidation from '../validations/sal/outgo-detail.validation';
import salReleaseValidation from '../validations/sal/release.validation';

const router = express.Router();

//#region ✅ Return (제품반입)
const returnHeader = new SalReturnCtl();
router.route('/returns/report').get(returnHeader.readReport);
router.route('/return/:uuid').get(returnHeader.read);
router.route('/return/:uuid/include-details').get(returnHeader.readIncludeDetails);
router.route('/return/:uuid/details').get(returnHeader.readDetails);
router.route('/returns').get(returnHeader.read);
router.route('/returns').post(returnHeader.create);
router.route('/returns').put(returnHeader.update);
router.route('/returns').patch(returnHeader.patch);
router.route('/returns').delete(returnHeader.delete);
//#endregion

//#region ✅ ReturnDetail (제품반입상세)
const returnDetail = new SalReturnDetailCtl();
router.route('/return-detail/:uuid').get(returnDetail.read);
router.route('/return-details').get(returnDetail.read);
//#endregion

//#region ✅ Order (제품수주)
const order = new SalOrderCtl();
router.route('/orders/report').get(order.readReport);
router.route('/order/:uuid').get(order.read);
router.route('/order/:uuid/include-details').get(order.readIncludeDetails);
router.route('/order/:uuid/details').get(order.readDetails);
router.route('/orders').get(order.read);
router.route('/orders').post(order.create);
router.route('/orders').put(order.update);
router.route('/orders').patch(order.patch);
router.route('/orders').delete(order.delete);
//#endregion

//#region ✅ OrderDetail (제품수주상세)
const orderDetail = new SalOrderDetailCtl();
router.route('/order-details/complete').put(orderDetail.updateComplete);
router.route('/order-detail/:uuid').get(orderDetail.read);
router.route('/order-details').get(orderDetail.read);
//#endregion

//#region ✅ Move (제품입고)
const income = new SalIncomeCtl();
router.route('/incomes/report').get(salIncomeValidation.readReport, validationCallback, income.readReport);
router.route('/income/:uuid').get(salIncomeValidation.readByUuid, validationCallback, income.readByUuid);
router.route('/incomes').get(salIncomeValidation.read, validationCallback, income.read);
router.route('/incomes').post(salIncomeValidation.create, validationCallback, income.create);
router.route('/incomes').put(salIncomeValidation.update, validationCallback, income.update);
router.route('/incomes').patch(salIncomeValidation.patch, validationCallback, income.patch);
router.route('/incomes').delete(salIncomeValidation.delete, validationCallback, income.delete);
//#endregion

//#region ✅ Release (제품출고)
const release = new SalReleaseCtl();
router.route('/releases/report').get(salReleaseValidation.readReport, validationCallback, release.readReport);
router.route('/release/:uuid').get(salReleaseValidation.readByUuid, validationCallback, release.readByUuid);
router.route('/releases').get(salReleaseValidation.read, validationCallback, release.read);
router.route('/releases').post(salReleaseValidation.create, validationCallback, release.create);
router.route('/releases').put(salReleaseValidation.update, validationCallback, release.update);
router.route('/releases').patch(salReleaseValidation.patch, validationCallback, release.patch);
router.route('/releases').delete(salReleaseValidation.delete, validationCallback, release.delete);
//#endregion

//#region ✅ OutgoOrder (제품출하지시)
const outgoOrder = new SalOutgoOrderCtl();
router.route('/outgo-orders/report').get(outgoOrder.readReport);
router.route('/outgo-order/:uuid').get(outgoOrder.read);
router.route('/outgo-order/:uuid/include-details').get(outgoOrder.readIncludeDetails);
router.route('/outgo-order/:uuid/details').get(outgoOrder.readDetails);
router.route('/outgo-orders').get(outgoOrder.read);
router.route('/outgo-orders').post(outgoOrder.create);
router.route('/outgo-orders').put(outgoOrder.update);
router.route('/outgo-orders').patch(outgoOrder.patch);
router.route('/outgo-orders').delete(outgoOrder.delete);
//#endregion

//#region ✅ OutgoOrderDetail (제품출하지시상세)
const outgoOrderDetail = new SalOutgoOrderDetailCtl();
router.route('/outgo-order-details/complete').put(outgoOrderDetail.updateComplete);
router.route('/outgo-order-detail/:uuid').get(outgoOrderDetail.read);
router.route('/outgo-order-details').get(outgoOrderDetail.read);
//#endregion

//#region ✅ Outgo (제품출하)
const outgo = new SalOutgoCtl();
router.route('/outgos/lot-tracking').get(salOutgoValidation.readLotTracking, validationCallback, outgo.readLotTracking);
router.route('/outgos/report').get(salOutgoValidation.readReport, validationCallback, outgo.readReport);
router.route('/outgo/:uuid').get(salOutgoValidation.readByUuid, validationCallback, outgo.readByUuid);
router.route('/outgo/:uuid/include-details').get(salOutgoValidation.readIncludeDetails, validationCallback, outgo.readIncludeDetails);
router.route('/outgo/:uuid/details').get(salOutgoValidation.readDetails, validationCallback, outgo.readDetails);
router.route('/outgos').get(salOutgoValidation.read, validationCallback, outgo.read);
router.route('/outgos').post(salOutgoValidation.create, validationCallback, outgo.create);
router.route('/outgos').put(salOutgoValidation.update, validationCallback, outgo.update);
router.route('/outgos').patch(salOutgoValidation.patch, validationCallback, outgo.patch);
router.route('/outgos').delete(salOutgoValidation.delete, validationCallback, outgo.delete);
//#endregion

//#region ✅ OutgoDetail (제품출하상세)
const outgoDetail = new SalOutgoDetailCtl();
router.route('/outgo-detail/:uuid').get(salOutgoDetailValidation.readByUuid, validationCallback, outgoDetail.readByUuid);
router.route('/outgo-details').get(salOutgoDetailValidation.read, validationCallback, outgoDetail.read);
//#endregion

export default router;