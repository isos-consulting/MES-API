import * as express from 'express';
import EqmHistoryCtl from '../controllers/eqm/history.controller';
import EqmInspDetailCtl from '../controllers/eqm/insp-detail.controller';
import EqmInspResultCtl from '../controllers/eqm/insp-result.controller';
import EqmInspCtl from '../controllers/eqm/insp.controller';
import EqmRepairHistoryCtl from '../controllers/eqm/repair-history.controller';
import validationCallback from '../utils/validationCallback';
import eqmHistoryValidation from '../validations/eqm/history.validation';
import eqmInspDetailValidation from '../validations/eqm/insp-detail.validation';
import eqmInspResultValidation from '../validations/eqm/insp-result.validation';
import eqmInspValidation from '../validations/eqm/insp.validation';
import eqmRepairHistoryValidation from '../validations/eqm/repair-history.validation';

const router = express.Router();

//#region ✅ History (설비개정이력관리)
const history = new EqmHistoryCtl();
router.route('/history/card').get(eqmHistoryValidation.readHistoryCard, validationCallback, history.readHistoryCard);
router.route('/history/:uuid').get(eqmHistoryValidation.readByUuid, validationCallback, history.read);
router.route('/histories').get(eqmHistoryValidation.read, validationCallback, history.read);
router.route('/histories').post(eqmHistoryValidation.create, validationCallback, history.create);
router.route('/histories').put(eqmHistoryValidation.update, validationCallback, history.update);
router.route('/histories').patch(eqmHistoryValidation.patch, validationCallback, history.patch);
router.route('/histories').delete(eqmHistoryValidation.delete, validationCallback, history.delete);
//#endregion

//#region ✅ Insp (설비검사기준서)
const insp = new EqmInspCtl();
router.route('/insp/apply').put(eqmInspValidation.updateApply, validationCallback, insp.updateApply);
router.route('/insp/cancel-apply').put(eqmInspValidation.updateCancelApply, validationCallback, insp.updateCancelApply);
router.route('/insp/:uuid').get(eqmInspValidation.readByUuid, validationCallback, insp.readByUuid);
router.route('/insp/:uuid/include-details').get(eqmInspValidation.readIncludeDetails, validationCallback, insp.readIncludeDetails);
router.route('/insp/:uuid/details').get(eqmInspValidation.readDetails, validationCallback, insp.readDetails);
router.route('/insps/include-details-by-equip').get(eqmInspValidation.readIncludeDetailsByEquip, validationCallback, insp.readIncludeDetailsByEquip);
router.route('/insps').get(eqmInspValidation.read, validationCallback, insp.read);
router.route('/insps').post(eqmInspValidation.create, validationCallback, insp.create);
router.route('/insps').put(eqmInspValidation.update, validationCallback, insp.update);
router.route('/insps').patch(eqmInspValidation.patch, validationCallback, insp.patch);
router.route('/insps').delete(eqmInspValidation.delete, validationCallback, insp.delete);
//#endregion

//#region ✅ InspDetail (설비검사기준서상세)
const inspDetail = new EqmInspDetailCtl();
router.route('/insp-detail/:uuid').get(eqmInspDetailValidation.readByUuid, validationCallback, inspDetail.readByUuid);
router.route('/insp-details').get(eqmInspDetailValidation.read, validationCallback, inspDetail.read);
//#endregion

//#region ✅ InspResult (설비검사성적서)
const inspResult = new EqmInspResultCtl();
router.route('/insp-result/:uuid').get(eqmInspResultValidation.readByUuid, validationCallback, inspResult.readByUuid);
router.route('/insp-results').get(eqmInspResultValidation.read, validationCallback, inspResult.read);
router.route('/insp-results').post(eqmInspResultValidation.create, validationCallback, inspResult.create);
router.route('/insp-results').put(eqmInspResultValidation.update, validationCallback, inspResult.update);
router.route('/insp-results').patch(eqmInspResultValidation.patch, validationCallback, inspResult.patch);
router.route('/insp-results').delete(eqmInspResultValidation.delete, validationCallback, inspResult.delete);
//#endregion

//#region ✅ RepairHistory (설비수리이력관리)
const repairHistory = new EqmRepairHistoryCtl();
router.route('/repair-history/:uuid').get(eqmRepairHistoryValidation.readByUuid, validationCallback, repairHistory.readByUuid);
router.route('/repair-histories').get(eqmRepairHistoryValidation.read, validationCallback, repairHistory.read);
router.route('/repair-histories').post(eqmRepairHistoryValidation.create, validationCallback, repairHistory.create);
router.route('/repair-histories').put(eqmRepairHistoryValidation.update, validationCallback, repairHistory.update);
router.route('/repair-histories').patch(eqmRepairHistoryValidation.patch, validationCallback, repairHistory.patch);
router.route('/repair-histories').delete(eqmRepairHistoryValidation.delete, validationCallback, repairHistory.delete);
//#endregion

export default router;