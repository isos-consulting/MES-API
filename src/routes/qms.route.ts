import * as express from 'express';

import QmsInspCtl from '../controllers/qms/insp.controller';
import QmsInspDetailCtl from '../controllers/qms/insp-detail.controller';
import QmsReworkCtl from '../controllers/qms/rework.controller';
import QmsReworkDisassembleCtl from '../controllers/qms/rework-disassemble.controller';
import QmsInspResultCtl from '../controllers/qms/insp-result.controller';
import qmsInspValidation from '../validations/qms/insp.validation';
import validationCallback from '../utils/validationCallback';
import qmsInspDetailValidation from '../validations/qms/insp-detail.validation';
import qmsInspResultValidation from '../validations/qms/insp-result.validation';
import qmsReworkValidation from '../validations/qms/rework.validation';
import qmsReworkDisassembleValidation from '../validations/qms/rework-disassemble.validation';

const router = express.Router();

//#region ✅ Insp (검사기준서)
const insp = new QmsInspCtl();
router.route('/insps/apply').put(qmsInspValidation.updateApply, validationCallback, insp.updateApply);
router.route('/insps/cancel-apply').put(qmsInspValidation.updateCancelApply, validationCallback, insp.updateCancelApply);
router.route('/insp/:uuid').get(qmsInspValidation.readByUuid, validationCallback, insp.readByUuid);
router.route('/insp/:uuid/include-details').get(qmsInspValidation.readIncludeDetails, validationCallback, insp.readIncludeDetails);
router.route('/insp/:uuid/details').get(qmsInspValidation.readDetails, validationCallback, insp.readDetails);
router.route('/receive/insp/include-details').get(qmsInspValidation.readIncludeDetailsByReceive, validationCallback, insp.readIncludeDetailsByReceive);
router.route('/proc/insp/include-details').get(qmsInspValidation.readIncludeDetailsByWork, validationCallback, insp.readIncludeDetailsByWork);
router.route('/insps').get(qmsInspValidation.read, validationCallback, insp.read);
router.route('/insps').post(qmsInspValidation.create, validationCallback, insp.create);
router.route('/insps').put(qmsInspValidation.update, validationCallback, insp.update);
router.route('/insps').patch(qmsInspValidation.patch, validationCallback, insp.patch);
router.route('/insps').delete(qmsInspValidation.delete, validationCallback, insp.delete);
//#endregion

//#region ✅ InspDetail (검사기준서상세)
const inspDetail = new QmsInspDetailCtl();
router.route('/insp-detail/:uuid').get(qmsInspDetailValidation.readByUuid, validationCallback, inspDetail.readByUuid);
router.route('/insp-details').get(qmsInspDetailValidation.read, validationCallback, inspDetail.read);
//#endregion

//#region ✅ receiveInspResult (검사성적서)
const inspResult = new QmsInspResultCtl();
// 📌 공정검사
router.route('/proc/insp-result/max-seq').get(qmsInspResultValidation.readMaxSeqInProcInsp, validationCallback, inspResult.readMaxSeqInProcInsp);
router.route('/proc/insp-results/report').get(qmsInspResultValidation.readProcDetailsByWork, validationCallback, inspResult.readProcDetailsByWork);
router.route('/proc/insp-results').get(qmsInspResultValidation.readProc, validationCallback, inspResult.readProc);
router.route('/proc/insp-result/:uuid/include-details').get(qmsInspResultValidation.readProcIncludeDetails, validationCallback, inspResult.readProcIncludeDetails);
router.route('/proc/insp-results').post(qmsInspResultValidation.createProcInsp, validationCallback, inspResult.createProcInsp);
router.route('/proc/insp-results').put(qmsInspResultValidation.updateProcInsp, validationCallback, inspResult.updateProcInsp);
router.route('/proc/insp-results').delete(qmsInspResultValidation.deleteProcInsp, validationCallback, inspResult.deleteProcInsp);

// 📌 수입검사
router.route('/receive/insp-results/waiting').get(qmsInspResultValidation.readWaitingReceive, validationCallback, inspResult.readWaitingReceive);
router.route('/receive/insp-results').get(qmsInspResultValidation.readReceive, validationCallback, inspResult.readReceive);
router.route('/receive/insp-result/:uuid/include-details').get(qmsInspResultValidation.readReceiveIncludeDetails, validationCallback, inspResult.readReceiveIncludeDetails);
router.route('/receive/insp-results').post(qmsInspResultValidation.createReceiveInsp, validationCallback, inspResult.createReceiveInsp);
router.route('/receive/insp-results').put(qmsInspResultValidation.updateReceiveInsp, validationCallback, inspResult.updateReceiveInsp);
router.route('/receive/insp-results').delete(qmsInspResultValidation.deleteReceiveInsp, validationCallback, inspResult.deleteReceiveInsp);

// 📌 최종검사
router.route('/final/insp-result/:uuid/include-details').get(qmsInspResultValidation.readFinalIncludeDetails, validationCallback, inspResult.readFinalIncludeDetails);
router.route('/final/insp-results').get(qmsInspResultValidation.readFinal, validationCallback, inspResult.readFinal);
router.route('/final/insp-results').post(qmsInspResultValidation.createFinalInsp, validationCallback, inspResult.createFinalInsp);
router.route('/final/insp-results').put(qmsInspResultValidation.updateFinalInsp, validationCallback, inspResult.updateFinalInsp);
router.route('/final/insp-results').delete(qmsInspResultValidation.deleteFinalInsp, validationCallback, inspResult.deleteFinalInsp);
//#endregion

//#region ✅ Rework (부적합품판정)
const rework = new QmsReworkCtl();
router.route('/rework/:uuid').get(qmsReworkValidation.readByUuid, validationCallback, rework.readByUuid);
router.route('/reworks').get(qmsReworkValidation.read, validationCallback, rework.read);
router.route('/reworks').post(qmsReworkValidation.create, validationCallback, rework.create);
router.route('/reworks/disassembles').post(qmsReworkValidation.createDisassemble, validationCallback, rework.createDisassemble);
router.route('/reworks').put(qmsReworkValidation.update, validationCallback, rework.update);
router.route('/reworks').patch(qmsReworkValidation.patch, validationCallback, rework.patch);
router.route('/reworks').delete(qmsReworkValidation.delete, validationCallback, rework.delete);
//#endregion

//#region ✅ Rework (부적합품판정-분해상세)
const reworkDisassemble = new QmsReworkDisassembleCtl();
router.route('/rework-disassemble/:uuid').get(qmsReworkDisassembleValidation.readByUuid, validationCallback, reworkDisassemble.readByUuid);
router.route('/rework-disassembles').get(qmsReworkDisassembleValidation.read, validationCallback, reworkDisassemble.read);
//#endregion

export default router;