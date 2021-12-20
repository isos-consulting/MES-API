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
import AdmFileMgmtTypeCtl from '../controllers/adm/file-mgmt-type.controller';
import AdmInspHandlingTypeCtl from '../controllers/adm/insp-handling-type.controller';

const router = express.Router();

//#region ✅ BomType (BOM 구성 유형)
const bomType = new AdmBomTypeCtl();
router.route('/bom-type/:uuid').get(bomType.read);
router.route('/bom-types').get(bomType.read);
router.route('/bom-types').post(bomType.create);
router.route('/bom-types').put(bomType.update);
router.route('/bom-types').patch(bomType.patch);
router.route('/bom-types').delete(bomType.delete);
//#endregion

//#region ✅ InspType (검사 유형)
const inspType = new AdmInspTypeCtl();
router.route('/insp-type/:uuid').get(inspType.read);
router.route('/insp-types').get(inspType.read);
router.route('/insp-types').post(inspType.create);
router.route('/insp-types').put(inspType.update);
router.route('/insp-types').patch(inspType.patch);
router.route('/insp-types').delete(inspType.delete);
//#endregion

//#region ✅ InspHandlingType (검사처리 유형)
const inspHandlingType = new AdmInspHandlingTypeCtl();
router.route('/insp-handling-type/:uuid').get(inspHandlingType.read);
router.route('/insp-handling-types').get(inspHandlingType.read);
router.route('/insp-handling-types').post(inspHandlingType.create);
router.route('/insp-handling-types').put(inspHandlingType.update);
router.route('/insp-handling-types').patch(inspHandlingType.patch);
router.route('/insp-handling-types').delete(inspHandlingType.delete);
//#endregion

//#region ✅ PrdPlanType (생산계획 유형)
const prdPlanType = new AdmPrdPlanTypeCtl();
router.route('/prd-plan-type/:uuid').get(prdPlanType.read);
router.route('/prd-plan-types').get(prdPlanType.read);
router.route('/prd-plan-types').post(prdPlanType.create);
router.route('/prd-plan-types').put(prdPlanType.update);
router.route('/prd-plan-types').patch(prdPlanType.patch);
router.route('/prd-plan-types').delete(prdPlanType.delete);
//#endregion

//#region ✅ InspDetailType (세부검사 유형)
const inspDetailType = new AdmInspDetailTypeCtl();
router.route('/insp-detail-type/:uuid').get(inspDetailType.read);
router.route('/insp-detail-types').get(inspDetailType.read);
router.route('/insp-detail-types').post(inspDetailType.create);
router.route('/insp-detail-types').put(inspDetailType.update);
router.route('/insp-detail-types').patch(inspDetailType.patch);
router.route('/insp-detail-types').delete(inspDetailType.delete);
//#endregion

//#region ✅ Transaction (수불 유형)
const transaction = new AdmTransactionCtl();
router.route('/transaction/:uuid').get(transaction.read);
router.route('/transactions').get(transaction.read);
router.route('/transactions').post(transaction.create);
router.route('/transactions').put(transaction.update);
router.route('/transactions').patch(transaction.patch);
router.route('/transactions').delete(transaction.delete);
//#endregion

//#region ✅ DemandType (요청 유형)
const demandType = new AdmDemandTypeCtl();
router.route('/demand-type/:uuid').get(demandType.read);
router.route('/demand-types').get(demandType.read);
router.route('/demand-types').post(demandType.create);
router.route('/demand-types').put(demandType.update);
router.route('/demand-types').patch(demandType.patch);
router.route('/demand-types').delete(demandType.delete);
//#endregion

//#region ✅ PatternOpt (자동번호발행 옵션)
const patternOpt = new AdmPatternOptCtl();
router.route('/pattern-opt/:uuid').get(patternOpt.read);
router.route('/pattern-opts').get(patternOpt.read);
router.route('/pattern-opts').post(patternOpt.create);
router.route('/pattern-opts').put(patternOpt.update);
router.route('/pattern-opts').patch(patternOpt.patch);
router.route('/pattern-opts').delete(patternOpt.delete);
//#endregion

//#region ✅ ReworkType (재작업 유형)
const reworkType = new AdmReworkTypeCtl();
router.route('/rework-type/:uuid').get(reworkType.read);
router.route('/rework-types').get(reworkType.read);
router.route('/rework-types').post(reworkType.create);
router.route('/rework-types').put(reworkType.update);
router.route('/rework-types').patch(reworkType.patch);
router.route('/rework-types').delete(reworkType.delete);
//#endregion

//#region ✅ StoreType (창고 유형)
const storeType = new AdmStoreTypeCtl();
router.route('/store-type/:uuid').get(storeType.read);
router.route('/store-types').get(storeType.read);
router.route('/store-types').post(storeType.create);
router.route('/store-types').put(storeType.update);
router.route('/store-types').patch(storeType.patch);
router.route('/store-types').delete(storeType.delete);
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

//#region ✅ FileMgmtType (파일관리유형)
const fileMgmtType = new AdmFileMgmtTypeCtl();
router.route('/file-mgmt-type/:uuid').get(fileMgmtType.read);
router.route('/file-mgmt-types').get(fileMgmtType.read);
router.route('/file-mgmt-types').post(fileMgmtType.create);
router.route('/file-mgmt-types').put(fileMgmtType.update);
router.route('/file-mgmt-types').patch(fileMgmtType.patch);
router.route('/file-mgmt-types').delete(fileMgmtType.delete);
//#endregion

//#region ✅ CompanyOpt (회사 옵션)
const companyOpt = new AdmCompanyOptCtl();
router.route('/company-opt/:uuid').get(companyOpt.read);
router.route('/company-opts').get(companyOpt.read);
router.route('/company-opts').post(companyOpt.create);
router.route('/company-opts').put(companyOpt.update);
router.route('/company-opts').patch(companyOpt.patch);
router.route('/company-opts').delete(companyOpt.delete);
//#endregion

export default router;