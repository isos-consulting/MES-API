import * as express from 'express';

import QmsInspCtl from '../controllers/qms/insp.controller';
import QmsInspDetailCtl from '../controllers/qms/insp-detail.controller';
import QmsReworkCtl from '../controllers/qms/rework.controller';
import QmsReworkDisassembleCtl from '../controllers/qms/rework-disassemble.controller';
import QmsInspResultCtl from '../controllers/qms/insp-result.controller';

const router = express.Router();

//#region ✅ Insp (검사기준서)
const insp = new QmsInspCtl();
router.route('/insps/apply').put(insp.updateApply);
router.route('/insps/cancel-apply').put(insp.updateCancelApply);
router.route('/insp/:uuid').get(insp.read);
router.route('/insp/:uuid/include-details').get(insp.readIncludeDetails);
router.route('/insp/:uuid/details').get(insp.readDetails);
router.route('/receive/insp/include-details').get(insp.readIncludeDetailsByReceive);
router.route('/proc/insp/include-details').get(insp.readIncludeDetailsByWork);
router.route('/insps').get(insp.read);
router.route('/insps').post(insp.create);
router.route('/insps').put(insp.update);
router.route('/insps').patch(insp.patch);
router.route('/insps').delete(insp.delete);
//#endregion

//#region ✅ InspDetail (검사기준서상세)
const inspDetail = new QmsInspDetailCtl();
router.route('/insp-detail/:uuid').get(inspDetail.read);
router.route('/insp-details').get(inspDetail.read);
//#endregion

//#region ✅ receiveInspResult (검사성적서)
const inspResult = new QmsInspResultCtl();
// 📌 공정검사
router.route('/proc/insp-result/max-seq').get(inspResult.readMaxSeqInProcInsp);
router.route('/proc/insp-results/report').get(inspResult.readProcDetailsByWork);
router.route('/proc/insp-results').get(inspResult.readProc);
router.route('/proc/insp-result/:uuid/include-details').get(inspResult.readProcIncludeDetails);
router.route('/proc/insp-results').post(inspResult.createProcInsp);
router.route('/proc/insp-results').put(inspResult.updateProcInsp);
router.route('/proc/insp-results').delete(inspResult.deleteProcInsp);

// 📌 수입검사
router.route('/receive/insp-results/waiting').get(inspResult.readWaitingReceive);
router.route('/receive/insp-results').get(inspResult.readReceive);
router.route('/receive/insp-result/:uuid/include-details').get(inspResult.readReceiveIncludeDetails);
router.route('/receive/insp-results').post(inspResult.createReceiveInsp);
router.route('/receive/insp-results').put(inspResult.updateReceiveInsp);
router.route('/receive/insp-results').delete(inspResult.deleteReceiveInsp);

// 📌 최종검사
router.route('/final/insp-results').get(inspResult.readFinal);
router.route('/final/insp-result/:uuid/include-details').get(inspResult.readFinalIncludeDetails);
router.route('/final/insp-results').post(inspResult.createFinalInsp);
router.route('/final/insp-results').put(inspResult.updateFinalInsp);
router.route('/final/insp-results').delete(inspResult.deleteFinalInsp);
//#endregion

//#region ✅ Rework (부적합품판정)
const rework = new QmsReworkCtl();
router.route('/rework/:uuid').get(rework.read);
router.route('/reworks').get(rework.read);
router.route('/reworks').post(rework.create);
router.route('/reworks/disassembles').post(rework.createDisassemble);
router.route('/reworks').put(rework.update);
router.route('/reworks').patch(rework.patch);
router.route('/reworks').delete(rework.delete);
//#endregion

//#region ✅ Rework (부적합품판정-분해상세)
const reworkDisassemble = new QmsReworkDisassembleCtl();
router.route('/rework-disassemble/:uuid').get(reworkDisassemble.read);
router.route('/rework-disassembles').get(reworkDisassemble.read);
//#endregion

export default router;