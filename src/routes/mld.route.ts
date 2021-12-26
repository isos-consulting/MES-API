import * as express from 'express';
import MldMoldCtl from '../controllers/mld/mold.controller';
import MldProblemCtl from '../controllers/mld/problem.controller';
import MldRepairHistoryCtl from '../controllers/mld/repair-history.controller';
import validationCallback from '../utils/validationCallback';
import mldMoldValidation from '../validations/mld/mold.validation';
import mldProblemValidation from '../validations/mld/problem.validation';
import mldRepairHistoryValidation from '../validations/mld/repair-history.validation';

const router = express.Router();

//#region ✅ Mold (금형관리)
const mold = new MldMoldCtl();
router.route('/mold/:uuid').get(mldMoldValidation.readByUuid, validationCallback, mold.read);
router.route('/molds').get(mldMoldValidation.read, validationCallback, mold.read);
router.route('/molds').post(mldMoldValidation.create, validationCallback, mold.create);
router.route('/molds').put(mldMoldValidation.update, validationCallback, mold.update);
router.route('/molds').patch(mldMoldValidation.patch, validationCallback, mold.patch);
router.route('/molds').delete(mldMoldValidation.delete, validationCallback, mold.delete);
//#endregion

//#region ✅ Problem (금형문제점관리)
const problem = new MldProblemCtl();
router.route('/problem/:uuid').get(mldProblemValidation.readByUuid, validationCallback, problem.read);
router.route('/problems').get(mldProblemValidation.read, validationCallback, problem.read);
router.route('/problems').post(mldProblemValidation.create, validationCallback, problem.create);
router.route('/problems').put(mldProblemValidation.update, validationCallback, problem.update);
router.route('/problems').patch(mldProblemValidation.patch, validationCallback, problem.patch);
router.route('/problems').delete(mldProblemValidation.delete, validationCallback, problem.delete);
//#endregion

//#region ✅ RepairHistory (금형수리이력관리)
const repairHistory = new MldRepairHistoryCtl();
router.route('/repair-history/:uuid').get(mldRepairHistoryValidation.readByUuid, validationCallback, repairHistory.read);
router.route('/repair-histories').get(mldRepairHistoryValidation.read, validationCallback, repairHistory.read);
router.route('/repair-histories').post(mldRepairHistoryValidation.create, validationCallback, repairHistory.create);
router.route('/repair-histories').put(mldRepairHistoryValidation.update, validationCallback, repairHistory.update);
router.route('/repair-histories').patch(mldRepairHistoryValidation.patch, validationCallback, repairHistory.patch);
router.route('/repair-histories').delete(mldRepairHistoryValidation.delete, validationCallback, repairHistory.delete);
//#endregion

export default router;