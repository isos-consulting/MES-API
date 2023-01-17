import * as express from 'express';

import KpiProductionCtl from '../controllers/kpi/production.controller';
import validationCallback from '../utils/validationCallback';
import kpiProductionValidation from '../validations/kpi/production.validation';

const router = express.Router();

//#region ✅ PRD (생산 KPI)
const production = new KpiProductionCtl();
router.route('/production/equip-productivity').get(kpiProductionValidation.readEquipProductivity, validationCallback, production.readEquipProductivity);
router.route('/production/downtime').get(kpiProductionValidation.readDowntime, validationCallback, production.readDowntime);
router.route('/production/work-plan-achievement-rate').get(kpiProductionValidation.readWorkPlanAchievementRate, validationCallback, production.readWorkPlanAchievementRate);
router.route('/production/worker-productivity').get(kpiProductionValidation.readWorkerProductivity, validationCallback, production.readWorkerProductivity);
router.route('/production/work-rejects-rate').get(kpiProductionValidation.readWorkRejectsRate, validationCallback, production.readWorkRejectsRate);
router.route('/production/order-work-rate').get(kpiProductionValidation.readOrderWorkRate, validationCallback, production.readOrderWork);
router.route('/production/order-work-month-rate').get(kpiProductionValidation.readOrderWorkMonthRate, validationCallback, production.readOrderWorkMonth);
router.route('/production/worker-work-price').get(kpiProductionValidation.readWorkerWorkPrice, validationCallback, production.readWorkerWorkPrice);
router.route('/production/worker-work-month-price').get(kpiProductionValidation.readWorkerWorkMonthPrice, validationCallback, production.readWorkerWorkPriceMonth);
//#endregion


export default router;