import * as express from 'express';
import EqmInspCtl from '../controllers/eqm/insp.controller';
import EqmRepairHistoryCtl from '../controllers/eqm/repair-history.controller';
import validationCallback from '../utils/validationCallback';
import eqmInspValidation from '../validations/eqm/insp.validation';
import eqmRepairHistoryValidation from '../validations/eqm/repair-history.validation';

const router = express.Router();

//#region ✅ Insp (설비검사기준서)
const insp = new EqmInspCtl();
router.route('/insp/apply').put(eqmInspValidation.updateApply, validationCallback, insp.updateApply);
router.route('/insp/cancel-apply').put(eqmInspValidation.updateCancelApply, validationCallback, insp.updateCancelApply);
router.route('/insp/:uuid').get(eqmInspValidation.readByUuid, validationCallback, insp.read);
router.route('/insp/:uuid/include-details').get(eqmInspValidation.readIncludeDetails, validationCallback, insp.readIncludeDetails);
router.route('/insp/:uuid/details').get(eqmInspValidation.readDetails, validationCallback, insp.readDetails);
router.route('/insps').get(eqmInspValidation.read, validationCallback, insp.read);
router.route('/insps').post(eqmInspValidation.create, validationCallback, insp.create);
router.route('/insps').put(eqmInspValidation.update, validationCallback, insp.update);
router.route('/insps').patch(eqmInspValidation.patch, validationCallback, insp.patch);
router.route('/insps').delete(eqmInspValidation.delete, validationCallback, insp.delete);
//#endregion

//#region ✅ InspDetail (설비검사기준서상세)
// const inspDetail = new EqmInspDetailCtl();
// router.route('/insp-detail/:uuid').get(inspDetail.read);
// router.route('/insp-details').get(inspDetail.read);
//#endregion

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