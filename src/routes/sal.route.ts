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
router.route('/incomes/report').get(income.readReport);
router.route('/income/:uuid').get(income.read);
router.route('/incomes').get(income.read);
router.route('/incomes').post(income.create);
router.route('/incomes').put(income.update);
router.route('/incomes').patch(income.patch);
router.route('/incomes').delete(income.delete);
//#endregion

//#region ✅ Release (제품출고)
const release = new SalReleaseCtl();
router.route('/releases/report').get(release.readReport);
router.route('/release/:uuid').get(release.read);
router.route('/releases').get(release.read);
router.route('/releases').post(release.create);
router.route('/releases').put(release.update);
router.route('/releases').patch(release.patch);
router.route('/releases').delete(release.delete);
//#endregion

//#region ✅ OutgoOrder (제품출하지시)
const outgoOrder = new SalOutgoOrderCtl();
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
router.route('/outgos/lot-tracking').get(outgo.readLotTracking);
router.route('/outgos/report').get(outgo.readReport);
router.route('/outgo/:uuid').get(outgo.read);
router.route('/outgo/:uuid/include-details').get(outgo.readIncludeDetails);
router.route('/outgo/:uuid/details').get(outgo.readDetails);
router.route('/outgos').get(outgo.read);
router.route('/outgos').post(outgo.create);
router.route('/outgos').put(outgo.update);
router.route('/outgos').patch(outgo.patch);
router.route('/outgos').delete(outgo.delete);
//#endregion

//#region ✅ OutgoDetail (제품출하상세)
const outgoDetail = new SalOutgoDetailCtl();
router.route('/outgo-detail/:uuid').get(outgoDetail.read);
router.route('/outgo-details').get(outgoDetail.read);
//#endregion

export default router;