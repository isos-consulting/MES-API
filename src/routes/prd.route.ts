import * as express from 'express';

import PrdReturnCtl from '../controllers/prd/return.controller';
import PrdDemandCtl from '../controllers/prd/demand.controller';
import PrdOrderInputCtl from '../controllers/prd/order-input.controller';
import PrdOrderCtl from '../controllers/prd/order.controller';
import PrdOrderWorkerCtl from '../controllers/prd/order-worker.controller';
import PrdOrderRoutingCtl from '../controllers/prd/order-routing.controller';
import PrdWorkCtl from '../controllers/prd/work.controller';
import PrdWorkInputCtl from '../controllers/prd/work-input.controller';
import PrdWorkWorkerCtl from '../controllers/prd/work-worker.controller';
import PrdWorkRoutingCtl from '../controllers/prd/work-routing.controller';
import PrdWorkRejectCtl from '../controllers/prd/work-reject.controller';
import PrdWorkDowntimeCtl from '../controllers/prd/work-downtime.controller';

const router = express.Router();

//#region ✅ Work (생산실적)
const work = new PrdWorkCtl();
router.route('/works/complete').put(work.updateComplete);
router.route('/works/cancel-complete').put(work.updateCancelComplete);
router.route('/works/report').get(work.readReport);
router.route('/work/:uuid').get(work.read);
router.route('/works').get(work.read);
router.route('/works').post(work.create);
router.route('/works').put(work.update);
router.route('/works').patch(work.patch);
router.route('/works').delete(work.delete);
//#endregion

//#region ✅ WorkRouting (실적-공정순서)
const workRouting = new PrdWorkRoutingCtl();
router.route('/work-routing/:uuid').get(workRouting.read);
router.route('/work-routings').get(workRouting.read);
router.route('/work-routings').put(workRouting.update);
router.route('/work-routings').patch(workRouting.patch);
//#endregion

//#region ✅ WorkReject (실적-부적합)
const workReject = new PrdWorkRejectCtl();
router.route('/work-rejects/by-work').get(workReject.readByWork);
router.route('/work-rejects/report').get(workReject.readReport);
router.route('/work-reject/:uuid').get(workReject.read);
router.route('/work-rejects').get(workReject.read);
router.route('/work-rejects').post(workReject.create);
router.route('/work-rejects').put(workReject.update);
router.route('/work-rejects').patch(workReject.patch);
router.route('/work-rejects').delete(workReject.delete);
//#endregion

//#region ✅ WorkDowntime (실적-비가동)
const workDowntime = new PrdWorkDowntimeCtl();
router.route('/work-downtimes/report').get(workDowntime.readReport);
router.route('/work-downtime/:uuid').get(workDowntime.read);
router.route('/work-downtimes').get(workDowntime.read);
router.route('/work-downtimes').post(workDowntime.create);
router.route('/work-downtimes').put(workDowntime.update);
router.route('/work-downtimes').patch(workDowntime.patch);
router.route('/work-downtimes').delete(workDowntime.delete);
//#endregion

//#region ✅ WorkInput (실적-자재투입)
const workInput = new PrdWorkInputCtl();
router.route('/work-inputs/ongoing').get(workInput.readOngoing);
router.route('/work-inputs/ongoing-group').get(workInput.readOngoingGroup);
router.route('/work-input/:uuid').get(workInput.read);
router.route('/work-inputs').get(workInput.read);
router.route('/work-inputs').post(workInput.create);
router.route('/work-inputs').put(workInput.update);
router.route('/work-inputs').patch(workInput.patch);
router.route('/work-inputs').delete(workInput.delete);
// router.route('/work-inputs/by-work').delete(workInput.deleteByWork);
//#endregion

//#region ✅ WorkWorker (실적-작업자투입)
const workWorker = new PrdWorkWorkerCtl();
router.route('/work-worker/:uuid').get(workWorker.read);
router.route('/work-workers').get(workWorker.read);
router.route('/work-workers').post(workWorker.create);
router.route('/work-workers').put(workWorker.update);
router.route('/work-workers').patch(workWorker.patch);
router.route('/work-workers').delete(workWorker.delete);
//#endregion

//#region ✅ Return (자재반납)
const returnCtl = new PrdReturnCtl();
router.route('/returns/report').get(returnCtl.readReport);
router.route('/return/:uuid').get(returnCtl.read);
router.route('/returns').get(returnCtl.read);
router.route('/returns').post(returnCtl.create);
router.route('/returns').put(returnCtl.update);
router.route('/returns').patch(returnCtl.patch);
router.route('/returns').delete(returnCtl.delete);
//#endregion

//#region ✅ Demand (자재출고요청)
const demand = new PrdDemandCtl();
router.route('/demands/complete').put(demand.updateComplete);
router.route('/demand/:uuid').get(demand.read);
router.route('/demands').get(demand.read);
router.route('/demands').post(demand.create);
router.route('/demands').put(demand.update);
router.route('/demands').patch(demand.patch);
router.route('/demands').delete(demand.delete);
//#endregion

//#region ✅ Order (작업지시)
const order = new PrdOrderCtl();
router.route('/orders/complete').put(order.updateComplete);
router.route('/orders/worker-group').put(order.updateWorkerGroup);
router.route('/order/:uuid').get(order.read);
router.route('/orders').get(order.read);
router.route('/orders').post(order.create);
router.route('/orders').put(order.update);
router.route('/orders').patch(order.patch);
router.route('/orders').delete(order.delete);
//#endregion

//#region ✅ OrderRouting (지시-공정순서)
const orderRouting = new PrdOrderRoutingCtl();
router.route('/order-routing/:uuid').get(orderRouting.read);
router.route('/order-routings').get(orderRouting.read);
router.route('/order-routings').put(orderRouting.update);
router.route('/order-routings').patch(orderRouting.patch);
//#endregion

//#region ✅ OrderInput (지시-자재투입)
const orderInput = new PrdOrderInputCtl();
router.route('/order-input/:uuid').get(orderInput.read);
router.route('/order-inputs').get(orderInput.read);
router.route('/order-inputs').post(orderInput.create);
router.route('/order-inputs').put(orderInput.update);
router.route('/order-inputs').patch(orderInput.patch);
router.route('/order-inputs').delete(orderInput.delete);
//#endregion

//#region ✅ OrderWorker (지시-작업자투입)
const orderWorker = new PrdOrderWorkerCtl();
router.route('/order-worker/:uuid').get(orderWorker.read);
router.route('/order-workers').get(orderWorker.read);
router.route('/order-workers').post(orderWorker.create);
router.route('/order-workers').put(orderWorker.update);
router.route('/order-workers').patch(orderWorker.patch);
router.route('/order-workers').delete(orderWorker.delete);
//#endregion

export default router;