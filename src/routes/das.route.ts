import * as express from 'express';
import DashboardCtl from '../controllers/das/dashboard.controller';

const router = express.Router();

//#region ✅ Dashboard (대시보드)
const dashboard = new DashboardCtl();
router.route('/work-compared-order').get(dashboard.readWorkComparedOrder);
router.route('/passed-insp-result').get(dashboard.readPassedInspResult);
router.route('/delayed-sal-order').get(dashboard.readDelayedSalOrder);
router.route('/operating-rate').get(dashboard.readOperatingRate);
router.route('/delivered-in-week').get(dashboard.readDeliveredInWeek);
//#endregion

export default router;