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
import PrdWorkRoutingOriginCtl from '../controllers/prd/work-routing-origin.controller';
import PrdWorkRejectCtl from '../controllers/prd/work-reject.controller';
import PrdWorkDowntimeCtl from '../controllers/prd/work-downtime.controller';
import prdOrderInputValidation from '../validations/prd/order-input.validation';
import validationCallback from '../utils/validationCallback';
import prdOrderWorkerValidation from '../validations/prd/order-worker.validation';
import prdOrderRoutingValidation from '../validations/prd/order-routing.validation';
import prdOrderValidation from '../validations/prd/order.validation';
import prdWorkInputValidation from '../validations/prd/work-input.validation';
import prdWorkWorkerValidation from '../validations/prd/work-worker.validation';
import prdWorkDowntimeValidation from '../validations/prd/work-downtime.validation';
import prdWorkRoutingValidation from '../validations/prd/work-routing.validation';
import prdWorkRoutingOriginValidation from '../validations/prd/work-routing-origin.validation';
import prdWorkRejectValidation from '../validations/prd/work-reject.validation';
import prdWorkValidation from '../validations/prd/work.validation';
import prdReturnValidation from '../validations/prd/return.validation';
import prdDemandValidation from '../validations/prd/demand.validation';
import PrdPlanMonthlyCtl from '../controllers/prd/plan-monthly.controller';
import planMonthlyValidation from '../validations/prd/plan-monthly.validation';
import PrdPlanDailyCtl from '../controllers/prd/plan-daily.controller';
import prdPlanDailyValidation from '../validations/prd/plan-daily.validation';

const router = express.Router();

//#region ✅ Work (생산실적)
const work = new PrdWorkCtl();
router.route('/works/complete').put(prdWorkValidation.updateComplete, validationCallback, work.updateComplete);
router.route('/works/cancel-complete').put(prdWorkValidation.updateCancelComplete, validationCallback, work.updateCancelComplete);
router.route('/works/report').get(prdWorkValidation.readReport, validationCallback, work.readReport);
router.route('/work/:uuid').get(prdWorkValidation.readByUuid, validationCallback, work.readByUuid);
router.route('/works').get(prdWorkValidation.read, validationCallback, work.read);
router.route('/works').post(prdWorkValidation.create, validationCallback, work.create);
router.route('/works').put(prdWorkValidation.update, validationCallback, work.update);
router.route('/works').patch(prdWorkValidation.patch, validationCallback, work.patch);
router.route('/works').delete(prdWorkValidation.delete, validationCallback, work.delete);
//#endregion

//#region ✅ WorkRoutingOrigin (실적-공정순서기준)
const workRoutingOrigin = new PrdWorkRoutingOriginCtl();
router.route('/work-routing-origin/:uuid').get(prdWorkRoutingOriginValidation.readByUuid, validationCallback, workRoutingOrigin.readByUuid);
router.route('/work-routing-origins').get(prdWorkRoutingOriginValidation.read, validationCallback, workRoutingOrigin.read);
router.route('/work-routing-origins').post(prdWorkRoutingOriginValidation.create, validationCallback, workRoutingOrigin.create);
router.route('/work-routing-origins').put(prdWorkRoutingOriginValidation.update, validationCallback, workRoutingOrigin.update);
router.route('/work-routing-origins').patch(prdWorkRoutingOriginValidation.patch, validationCallback, workRoutingOrigin.patch);
router.route('/work-routing-origins').delete(prdWorkRoutingOriginValidation.delete, validationCallback, workRoutingOrigin.delete);
//#endregion

//#region ✅ WorkRouting (실적-공정순서)
const workRouting = new PrdWorkRoutingCtl();
router.route('/work-routings/cancel-complete').put(prdWorkRoutingValidation.updateCancelComplete, validationCallback, workRouting.updateCancelComplete);
router.route('/work-routings/complete').patch(prdWorkRoutingValidation.updateComplete, validationCallback, workRouting.updateComplete);
router.route('/work-routing/:uuid').get(prdWorkRoutingValidation.readByUuid, validationCallback, workRouting.readByUuid);
router.route('/work-routings').get(prdWorkRoutingValidation.read, validationCallback, workRouting.read);
router.route('/work-routings').post(prdWorkRoutingValidation.create, validationCallback, workRouting.create);
router.route('/work-routings').put(prdWorkRoutingValidation.update, validationCallback, workRouting.update);
router.route('/work-routings').patch(prdWorkRoutingValidation.patch, validationCallback, workRouting.patch);
router.route('/work-routings').delete(prdWorkRoutingValidation.delete, validationCallback, workRouting.delete);
//#endregion

//#region ✅ WorkReject (실적-부적합)
const workReject = new PrdWorkRejectCtl();
router.route('/work-rejects/by-work').get(prdWorkRejectValidation.readByWork, validationCallback, workReject.readByWork);
router.route('/work-rejects/report').get(prdWorkRejectValidation.readReport, validationCallback, workReject.readReport);
router.route('/work-reject/:uuid').get(prdWorkRejectValidation.readByUuid, validationCallback, workReject.readByUuid);
router.route('/work-rejects').get(prdWorkRejectValidation.read, validationCallback, workReject.read);
router.route('/work-rejects').post(prdWorkRejectValidation.create, validationCallback, workReject.create);
router.route('/work-rejects').put(prdWorkRejectValidation.update, validationCallback, workReject.update);
router.route('/work-rejects').patch(prdWorkRejectValidation.patch, validationCallback, workReject.patch);
router.route('/work-rejects').delete(prdWorkRejectValidation.delete, validationCallback, workReject.delete);
//#endregion

//#region ✅ WorkDowntime (실적-비가동)
const workDowntime = new PrdWorkDowntimeCtl();
router.route('/work-downtimes/report').get(prdWorkDowntimeValidation.readReport, validationCallback, workDowntime.readReport);
router.route('/work-downtime/:uuid').get(prdWorkDowntimeValidation.readByUuid, validationCallback, workDowntime.readByUuid);
router.route('/work-downtimes').get(prdWorkDowntimeValidation.read, validationCallback, workDowntime.read);
router.route('/work-downtimes').post(prdWorkDowntimeValidation.create, validationCallback, workDowntime.create);
router.route('/work-downtimes').put(prdWorkDowntimeValidation.update, validationCallback, workDowntime.update);
router.route('/work-downtimes').patch(prdWorkDowntimeValidation.patch, validationCallback, workDowntime.patch);
router.route('/work-downtimes').delete(prdWorkDowntimeValidation.delete, validationCallback, workDowntime.delete);
//#endregion

//#region ✅ WorkInput (실적-자재투입)
const workInput = new PrdWorkInputCtl();
router.route('/work-inputs/group').get(prdWorkInputValidation.readWorkInputGroup, validationCallback, workInput.readWorkInputGroup);
router.route('/work-input/:uuid').get(prdWorkInputValidation.readByUuid, validationCallback, workInput.readByUuid);
router.route('/work-inputs').get(prdWorkInputValidation.read, validationCallback, workInput.read);
router.route('/work-inputs').post(prdWorkInputValidation.create, validationCallback, workInput.create);
router.route('/work-inputs').put(prdWorkInputValidation.update, validationCallback, workInput.update);
router.route('/work-inputs').patch(prdWorkInputValidation.patch, validationCallback, workInput.patch);
router.route('/work-inputs').delete(prdWorkInputValidation.delete, validationCallback, workInput.delete);
// router.route('/work-inputs/by-work').delete(workInput.deleteByWork);
//#endregion

//#region ✅ WorkWorker (실적-작업자투입)
const workWorker = new PrdWorkWorkerCtl();
router.route('/work-worker/:uuid').get(prdWorkWorkerValidation.readByUuid, validationCallback, workWorker.readByUuid);
router.route('/work-workers').get(prdWorkWorkerValidation.read, validationCallback, workWorker.read);
router.route('/work-workers').post(prdWorkWorkerValidation.create, validationCallback, workWorker.create);
router.route('/work-workers').put(prdWorkWorkerValidation.update, validationCallback, workWorker.update);
router.route('/work-workers').patch(prdWorkWorkerValidation.patch, validationCallback, workWorker.patch);
router.route('/work-workers').delete(prdWorkWorkerValidation.delete, validationCallback, workWorker.delete);
//#endregion

//#region ✅ planMonthly (월 생산계획)
const planMonthly = new PrdPlanMonthlyCtl();
router.route('/plan-month/:uuid').get(planMonthlyValidation.readByUuid, validationCallback, planMonthly.readByUuid);
router.route('/plan-monthly').get(planMonthlyValidation.read, validationCallback, planMonthly.read);
router.route('/plan-monthly').post(planMonthlyValidation.create, validationCallback, planMonthly.create);
router.route('/plan-monthly').put(planMonthlyValidation.update, validationCallback, planMonthly.update);
router.route('/plan-monthly').patch(planMonthlyValidation.patch, validationCallback, planMonthly.patch);
router.route('/plan-monthly').delete(planMonthlyValidation.delete, validationCallback, planMonthly.delete);
//#endregion

// #region ✅ planMonthly (일 생산계획)
const planDaily = new PrdPlanDailyCtl();
router.route('/plan-day/:uuid').get(prdPlanDailyValidation.readByUuid, validationCallback, planDaily.readByUuid);
router.route('/plan-daily').get(prdPlanDailyValidation.read, validationCallback, planDaily.read);
router.route('/plan-daily').post(prdPlanDailyValidation.create, validationCallback, planDaily.create);
router.route('/plan-daily').put(prdPlanDailyValidation.update, validationCallback, planDaily.update);
router.route('/plan-daily').patch(prdPlanDailyValidation.patch, validationCallback, planDaily.patch);
router.route('/plan-daily').delete(prdPlanDailyValidation.delete, validationCallback, planDaily.delete);
// #endregion

//#region ✅ Return (자재반납)
const returnCtl = new PrdReturnCtl();
router.route('/returns/report').get(prdReturnValidation.readReport, validationCallback, returnCtl.readReport);
router.route('/return/:uuid').get(prdReturnValidation.readByUuid, validationCallback, returnCtl.readByUuid);
router.route('/returns').get(prdReturnValidation.read, validationCallback, returnCtl.read);
router.route('/returns').post(prdReturnValidation.create, validationCallback, returnCtl.create);
router.route('/returns').put(prdReturnValidation.update, validationCallback, returnCtl.update);
router.route('/returns').patch(prdReturnValidation.patch, validationCallback, returnCtl.patch);
router.route('/returns').delete(prdReturnValidation.delete, validationCallback, returnCtl.delete);
//#endregion

//#region ✅ Demand (자재출고요청)
const demand = new PrdDemandCtl();
router.route('/demands/complete').put(prdDemandValidation.updateComplete, validationCallback, demand.updateComplete);
router.route('/demand/:uuid').get(prdDemandValidation.readByUuid, validationCallback, demand.readByUuid);
router.route('/demands').get(prdDemandValidation.read, validationCallback, demand.read);
router.route('/demands').post(prdDemandValidation.create, validationCallback, demand.create);
router.route('/demands').put(prdDemandValidation.update, validationCallback, demand.update);
router.route('/demands').patch(prdDemandValidation.patch, validationCallback, demand.patch);
router.route('/demands').delete(prdDemandValidation.delete, validationCallback, demand.delete);
//#endregion

//#region ✅ Order (작업지시)
const order = new PrdOrderCtl();
router.route('/multi-proc-by-orders').get(prdOrderValidation.readMultiProcByOrder, validationCallback, order.readMultiProcByOrder);
router.route('/orders/complete').put(prdOrderValidation.updateComplete, validationCallback, order.updateComplete);
router.route('/orders/worker-group').put(prdOrderValidation.updateWorkerGroup, validationCallback, order.updateWorkerGroup);
router.route('/order/:uuid').get(prdOrderValidation.readByUuid, validationCallback, order.readByUuid);
router.route('/orders').get(prdOrderValidation.read, validationCallback, order.read);
router.route('/orders').post(prdOrderValidation.create, validationCallback, order.create);
router.route('/orders').put(prdOrderValidation.update, validationCallback, order.update);
router.route('/orders').patch(prdOrderValidation.patch, validationCallback, order.patch);
router.route('/orders').delete(prdOrderValidation.delete, validationCallback, order.delete);
//#endregion

//#region ✅ OrderRouting (지시-공정순서)
const orderRouting = new PrdOrderRoutingCtl();
router.route('/order-routing/:uuid').get(prdOrderRoutingValidation.readByUuid, validationCallback, orderRouting.readByUuid);
router.route('/order-routings').get(prdOrderRoutingValidation.read, validationCallback, orderRouting.read);
router.route('/order-routings').post(prdOrderRoutingValidation.create, validationCallback, orderRouting.create);
router.route('/order-routings').put(prdOrderRoutingValidation.update, validationCallback, orderRouting.update);
router.route('/order-routings').patch(prdOrderRoutingValidation.patch, validationCallback, orderRouting.patch);
router.route('/order-routings').delete(prdOrderRoutingValidation.delete, validationCallback, orderRouting.delete);
//#endregion

//#region ✅ OrderInput (지시-자재투입)
const orderInput = new PrdOrderInputCtl();
router.route('/order-input/:uuid').get(prdOrderInputValidation.readByUuid, validationCallback, orderInput.readByUuid);
router.route('/order-inputs').get(prdOrderInputValidation.read, validationCallback, orderInput.read);
router.route('/order-inputs').post(prdOrderInputValidation.create, validationCallback, orderInput.create);
router.route('/order-inputs').put(prdOrderInputValidation.update, validationCallback, orderInput.update);
router.route('/order-inputs').patch(prdOrderInputValidation.patch, validationCallback, orderInput.patch);
router.route('/order-inputs').delete(prdOrderInputValidation.delete, validationCallback, orderInput.delete);
//#endregion

//#region ✅ OrderWorker (지시-작업자투입)
const orderWorker = new PrdOrderWorkerCtl();
router.route('/order-worker/:uuid').get(prdOrderWorkerValidation.readByUuid, validationCallback, orderWorker.readByUuid);
router.route('/order-workers').get(prdOrderWorkerValidation.read, validationCallback, orderWorker.read);
router.route('/order-workers').post(prdOrderWorkerValidation.create, validationCallback, orderWorker.create);
router.route('/order-workers').put(prdOrderWorkerValidation.update, validationCallback, orderWorker.update);
router.route('/order-workers').patch(prdOrderWorkerValidation.patch, validationCallback, orderWorker.patch);
router.route('/order-workers').delete(prdOrderWorkerValidation.delete, validationCallback, orderWorker.delete);
//#endregion

export default router;