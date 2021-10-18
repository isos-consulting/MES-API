import * as express from 'express';

import MatReturnDetailCtl from '../controllers/mat/return-detail.controller';
import MatReturnCtl from '../controllers/mat/return.controller';
import MatOrderDetailCtl from '../controllers/mat/order-detail.controller';
import MatOrderCtl from '../controllers/mat/order.controller';
import MatReceiveDetailCtl from '../controllers/mat/receive-detail.controller';
import MatReceiveCtl from '../controllers/mat/receive.controller';
import MatReleaseCtl from '../controllers/mat/release.controller';

const router = express.Router();

//#region ✅ Release (자재공정출고)
const release = new MatReleaseCtl();
router.route('/releases/report').get(release.readReport);
router.route('/release/:uuid').get(release.read);
router.route('/releases').get(release.read);
router.route('/releases').post(release.create);
router.route('/releases').put(release.update);
router.route('/releases').patch(release.patch);
router.route('/releases').delete(release.delete);
//#endregion

//#region ✅ Return (자재반출)
const returnHeader = new MatReturnCtl();
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

//#region ✅ ReturnDetail (자재반출상세)
const returnDetail = new MatReturnDetailCtl();
router.route('/return-detail/:uuid').get(returnDetail.read);
router.route('/return-details').get(returnDetail.read);
//#endregion

//#region ✅ Order (자재발주)
const order = new MatOrderCtl();
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

//#region ✅ OrderDetail (자재발주상세)
const orderDetail = new MatOrderDetailCtl();
router.route('/order-details/complete').put(orderDetail.updateComplete);
router.route('/order-detail/:uuid').get(orderDetail.read);
router.route('/order-details').get(orderDetail.read);
//#endregion

//#region ✅ Receive (자재입하)
const receive = new MatReceiveCtl();
router.route('/receives/lot-tracking').get(receive.readLotTracking);
router.route('/receives/report').get(receive.readReport);
router.route('/receive/:uuid').get(receive.read);
router.route('/receive/:uuid/include-details').get(receive.readIncludeDetails);
router.route('/receive/:uuid/details').get(receive.readDetails);
router.route('/receives').get(receive.read);
router.route('/receives').post(receive.create);
router.route('/receives').put(receive.update);
router.route('/receives').patch(receive.patch);
router.route('/receives').delete(receive.delete);
//#endregion

//#region ✅ ReceiveDetail (자재입하상세)
const receiveDetail = new MatReceiveDetailCtl();
router.route('/receive-detail/:uuid').get(receiveDetail.read);
router.route('/receive-details').get(receiveDetail.read);
//#endregion

//#endregion

export default router;