import * as express from 'express';

import MatReturnDetailCtl from '../controllers/mat/return-detail.controller';
import MatReturnCtl from '../controllers/mat/return.controller';
import MatOrderDetailCtl from '../controllers/mat/order-detail.controller';
import MatOrderCtl from '../controllers/mat/order.controller';
import MatReceiveDetailCtl from '../controllers/mat/receive-detail.controller';
import MatReceiveCtl from '../controllers/mat/receive.controller';
import MatReleaseCtl from '../controllers/mat/release.controller';
import matReceiveValidation from '../validations/mat/receive.validation';
import validationCallback from '../utils/validationCallback';
import matReceiveDetailValidation from '../validations/mat/receive-detail.validation';
import matReturnValidation from '../validations/mat/return.validation';
import matReturnDetailValidation from '../validations/mat/return-detail.validation';
import matReleaseValidation from '../validations/mat/release.validation';

const router = express.Router();

//#region ✅ Release (자재출고)
const release = new MatReleaseCtl();
router.route('/releases/report').get(matReleaseValidation.readReport, validationCallback, release.readReport);
router.route('/release/:uuid').get(matReleaseValidation.readByUuid, validationCallback, release.readByUuid);
router.route('/releases').get(matReleaseValidation.read, validationCallback, release.read);
router.route('/releases').post(matReleaseValidation.create, validationCallback, release.create);
router.route('/releases').put(matReleaseValidation.update, validationCallback, release.update);
router.route('/releases').patch(matReleaseValidation.patch, validationCallback, release.patch);
router.route('/releases').delete(matReleaseValidation.delete, validationCallback, release.delete);
//#endregion

//#region ✅ Return (자재반출)
const returnHeader = new MatReturnCtl();
router.route('/returns/report').get(matReturnValidation.readReport, validationCallback, returnHeader.readReport);
router.route('/return/:uuid').get(matReturnValidation.readByUuid, validationCallback, returnHeader.readByUuid);
router.route('/return/:uuid/include-details').get(matReturnValidation.readIncludeDetails, validationCallback, returnHeader.readIncludeDetails);
router.route('/return/:uuid/details').get(matReturnValidation.readDetails, validationCallback, returnHeader.readDetails);
router.route('/returns').get(matReturnValidation.read, validationCallback, returnHeader.read);
router.route('/returns').post(matReturnValidation.create, validationCallback, returnHeader.create);
router.route('/returns').put(matReturnValidation.update, validationCallback, returnHeader.update);
router.route('/returns').patch(matReturnValidation.patch, validationCallback, returnHeader.patch);
router.route('/returns').delete(matReturnValidation.delete, validationCallback, returnHeader.delete);
//#endregion

//#region ✅ ReturnDetail (자재반출상세)
const returnDetail = new MatReturnDetailCtl();
router.route('/return-detail/:uuid').get(matReturnDetailValidation.readByUuid, validationCallback, returnDetail.readByUuid);
router.route('/return-details').get(matReturnDetailValidation.read, validationCallback, returnDetail.read);
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
router.route('/receives/lot-tracking').get(matReceiveValidation.readLotTracking, validationCallback, receive.readLotTracking);
router.route('/receives/report').get(matReceiveValidation.readReport, validationCallback, receive.readReport);
router.route('/receive/:uuid').get(matReceiveValidation.readByUuid, validationCallback, receive.readByUuid);
router.route('/receive/:uuid/include-details').get(matReceiveValidation.readIncludeDetails, validationCallback, receive.readIncludeDetails);
router.route('/receive/:uuid/details').get(matReceiveValidation.readDetails, validationCallback, receive.readDetails);
router.route('/receives').get(matReceiveValidation.read, validationCallback, receive.read);
router.route('/receives').post(matReceiveValidation.create, validationCallback, receive.create);
router.route('/receives').put(matReceiveValidation.update, validationCallback, receive.update);
router.route('/receives').patch(matReceiveValidation.patch, validationCallback, receive.patch);
router.route('/receives').delete(matReceiveValidation.delete, validationCallback, receive.delete);
//#endregion

//#region ✅ ReceiveDetail (자재입하상세)
const receiveDetail = new MatReceiveDetailCtl();
router.route('/receive-detail/:uuid').get(matReceiveDetailValidation.readByUuid, validationCallback, receiveDetail.readByUuid);
router.route('/receive-details').get(matReceiveDetailValidation.read, validationCallback, receiveDetail.read);
//#endregion

//#endregion

export default router;