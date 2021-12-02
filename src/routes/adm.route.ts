import * as express from 'express';
import AdmBomTypeCtl from '../controllers/adm/bom-type.controller';
import AdmCompanyOptCtl from '../controllers/adm/company-opt.controller';
import AdmDemandTypeCtl from '../controllers/adm/demand-type.controller';
import AdmInspTypeCtl from '../controllers/adm/insp-type.controller';
import AdmPatternOptCtl from '../controllers/adm/pattern-opt.controller';
import AdmPrdPlanTypeCtl from '../controllers/adm/prd-plan-type.controller';
import AdmInspDetailTypeCtl from '../controllers/adm/insp-detail-type.controller';
import AdmReworkTypeCtl from '../controllers/adm/rework-type.controller';
import AdmStoreTypeCtl from '../controllers/adm/store-type.controller';
import AdmTransactionCtl from '../controllers/adm/transaction.controller';
import AdmFileMgmtCtl from '../controllers/adm/file-mgmt.controller';
import AdmInspHandlingTypeCtl from '../controllers/adm/insp-handling-type.controller';

const router = express.Router();

//#region ✅ BomType (BOM 구성 유형)
const bomType = new AdmBomTypeCtl();
router.route('/bom-types').get(bomType.read);
//#endregion

//#region ✅ InspType (검사 유형)
const inspType = new AdmInspTypeCtl();
router.route('/insp-types').get(inspType.read);
//#endregion

//#region ✅ InspHandlingType (검사처리 유형)
const inspHandlingType = new AdmInspHandlingTypeCtl();
router.route('/insp-handling-types').get(inspHandlingType.read);
//#endregion

//#region ✅ PrdPlanType (생산계획 유형)
const prdPlanType = new AdmPrdPlanTypeCtl();
router.route('/prd-plan-types').get(prdPlanType.read);
//#endregion

//#region ✅ InspDetailType (세부검사 유형)
const inspDetailType = new AdmInspDetailTypeCtl();
router.route('/insp-detail-types').get(inspDetailType.read);
//#endregion

//#region ✅ Transaction (수불 유형)
const transaction = new AdmTransactionCtl();
router.route('/transactions').get(transaction.read);
//#endregion

//#region ✅ DemandType (요청 유형)
const demandType = new AdmDemandTypeCtl();
router.route('/demand-types').get(demandType.read);
//#endregion

//#region ✅ PatternOpt (자동번호발행 옵션)
const patternOpt = new AdmPatternOptCtl();
router.route('/pattern-opt/:uuid').get(patternOpt.read);
router.route('/pattern-opts').get(patternOpt.create);
router.route('/pattern-opts').post(patternOpt.update);
router.route('/pattern-opts').patch(patternOpt.patch);
router.route('/pattern-opts').delete(patternOpt.delete);
//#endregion

//#region ✅ ReworkType (재작업 유형)
const reworkType = new AdmReworkTypeCtl();
router.route('/rework-types').get(reworkType.read);
//#endregion

//#region ✅ StoreType (창고 유형)
const storeType = new AdmStoreTypeCtl();
router.route('/store-types').get(storeType.read);
//#endregion

//#region ✅ FileMgmt (파일관리)
const fileMgmt = new AdmFileMgmtCtl();
router.route('/file-mgmt/:uuid').get(fileMgmt.read);
router.route('/file-mgmts').get(fileMgmt.read);
router.route('/file-mgmts').post(fileMgmt.create);
router.route('/file-mgmts').put(fileMgmt.update);
router.route('/file-mgmts').patch(fileMgmt.patch);
router.route('/file-mgmts').delete(fileMgmt.delete);
//#endregion

//#region ✅ CompanyOpt (회사 옵션)
const companyOpt = new AdmCompanyOptCtl();
router.route('/company-opts').get(companyOpt.read);
//#endregion

export default router;