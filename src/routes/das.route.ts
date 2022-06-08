import * as express from 'express';
import DashboardCtl from '../controllers/das/dashboard.controller';
import validationCallback from '../utils/validationCallback';
import dashboardValidation from '../validations/das/dashboard.validation';

const router = express.Router();

//#region ✅ Dashboard (대시보드)
const dashboard = new DashboardCtl();
router.route('/overall-status').get(dashboardValidation.readOverallStatus, validationCallback, dashboard.readOverallStatus);
router.route('/realtime-status').get(dashboardValidation.readRealtimeStatus, validationCallback, dashboard.readRealtimeStatus);
//#endregion

export default router;