import * as express from 'express';
import MldMoldCtl from '../controllers/mld/mold.controller';
import MldProblemCtl from '../controllers/mld/problem.controller';
import MldRepairHistoryCtl from '../controllers/mld/repair-history.controller';

const router = express.Router();

//#region ✅ Mold (금형관리)
const mold = new MldMoldCtl();
router.route('/mold/:uuid').get(mold.read);
router.route('/molds').get(mold.read);
router.route('/molds').post(mold.create);
router.route('/molds').put(mold.update);
router.route('/molds').patch(mold.patch);
router.route('/molds').delete(mold.delete);
//#endregion

//#region ✅ Problem (금형문제점관리)
const problem = new MldProblemCtl();
router.route('/problem/:uuid').get(problem.read);
router.route('/problems').get(problem.read);
router.route('/problems').post(problem.create);
router.route('/problems').put(problem.update);
router.route('/problems').patch(problem.patch);
router.route('/problems').delete(problem.delete);
//#endregion

//#region ✅ RepairHistory (금형수리이력관리)
const repairHistory = new MldRepairHistoryCtl();
router.route('/repair-history/:uuid').get(repairHistory.read);
router.route('/repair-histories').get(repairHistory.read);
router.route('/repair-histories').post(repairHistory.create);
router.route('/repair-histories').put(repairHistory.update);
router.route('/repair-histories').patch(repairHistory.patch);
router.route('/repair-histories').delete(repairHistory.delete);
//#endregion

export default router;