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
//#endregion


export default router;