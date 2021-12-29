import * as express from 'express';
import EqmRepairHistoryCtl from '../controllers/eqm/repair-history.controller';
import validationCallback from '../utils/validationCallback';
import eqmRepairHistoryValidation from '../validations/eqm/repair-history.validation';

const router = express.Router();

//#region ✅ RepairHistory (설비수리이력관리)
const repairHistory = new EqmRepairHistoryCtl();
router.route('/repair-history/:uuid').get(eqmRepairHistoryValidation.readByUuid, validationCallback, repairHistory.read);
router.route('/repair-histories').get(eqmRepairHistoryValidation.read, validationCallback, repairHistory.read);
router.route('/repair-histories').post(eqmRepairHistoryValidation.create, validationCallback, repairHistory.create);
router.route('/repair-histories').put(eqmRepairHistoryValidation.update, validationCallback, repairHistory.update);
router.route('/repair-histories').patch(eqmRepairHistoryValidation.patch, validationCallback, repairHistory.patch);
router.route('/repair-histories').delete(eqmRepairHistoryValidation.delete, validationCallback, repairHistory.delete);
//#endregion

export default router;