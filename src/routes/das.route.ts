import * as express from 'express';
import Dashboard2Ctl from '../controllers/das/dashboard2.controller';
import DashboardCtl from '../controllers/das/dashboard.controller';
import validationCallback from '../utils/validationCallback';
import dashboardValidation from '../validations/das/dashboard.validation';

const router = express.Router();

//#region ✅ Dashboard (대시보드)
const dashboard = new DashboardCtl();
router.route('/overall-status').get(dashboardValidation.readOverallStatus, validationCallback, dashboard.readOverallStatus);
router.route('/realtime-status').get(dashboardValidation.readRealtimeStatus, validationCallback, dashboard.readRealtimeStatus);


const dashboard2 = new Dashboard2Ctl();
router.route('/work-compared-order').get(dashboard2.readWorkComparedOrder);
router.route('/passed-insp-result').get(dashboard2.readPassedInspResult);
router.route('/delayed-sal-order').get(dashboard2.readDelayedSalOrder);
router.route('/operating-rate').get(dashboard2.readOperatingRate);
router.route('/delivered-in-week').get(dashboard2.readDeliveredInWeek);
//#endregion

export default router;