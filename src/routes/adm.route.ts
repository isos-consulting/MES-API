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
import AdmTransactionCtl from '../controllers/adm/tran-type.controller';
import AdmFileMgmtCtl from '../controllers/adm/file-mgmt.controller';
import AdmFileMgmtTypeCtl from '../controllers/adm/file-mgmt-type.controller';
import AdmInspHandlingTypeCtl from '../controllers/adm/insp-handling-type.controller';
import AdmCycleUnitCtl from '../controllers/adm/cycle-unit.controller';
import admInspDetailTypeValidation from '../validations/adm/insp-detail-type.validation';
import admCycleUnitValidation from '../validations/adm/cycle-unit.validation';
import AdmDailyInspCycleCtl from '../controllers/adm/daily-insp-cycle.controller';
import admDailyInspCycleValidation from '../validations/adm/daily-insp-cycle.validation';
import validationCallback from '../utils/validationCallback';
import admFileMgmtTypeValidation from '../validations/adm/file-mgmt-type.validation';
import admFileMgmtDetailTypeValidation from '../validations/adm/file-mgmt-detail-type.validation';
import AdmFileMgmtDetailTypeCtl from '../controllers/adm/file-mgmt-detail-type.controller';
import admFileMgmtValidation from '../validations/adm/file-mgmt.validation';
import admTranTypeValidation from '../validations/adm/tran-type.validation';
import AdmBomInputTypeCtl from '../controllers/adm/bom-input-type.controller';
import admBomInputTypeValidation from '../validations/adm/bom-input-type.validation';
import admDemandTypeValidation from '../validations/adm/demand-type.validation';
import admBomTypeValidation from '../validations/adm/bom-type.validation';
import admCompanyOptValidation from '../validations/adm/company-opt.validation';
import admPrdPlanTypeValidation from '../validations/adm/prd-plan-type.validation';
import admStoreTypeValidation from '../validations/adm/store-type.validation';
import admPatternOptValidation from '../validations/adm/pattern-opt.validation';
import admReworkTypeValidation from '../validations/adm/rework-type.validation';
import admInspTypeValidation from '../validations/adm/insp-type.validation';
import admInspHandlingTypeValidation from '../validations/adm/insp-handling-type.validation';

const router = express.Router();

//#region ✅ BomType (BOM 구성 유형)
const bomType = new AdmBomTypeCtl();
router.route('/bom-type/:uuid').get(admBomTypeValidation.readByUuid, validationCallback, bomType.readByUuid);
router.route('/bom-types').get(admBomTypeValidation.read, validationCallback, bomType.read);
router.route('/bom-types').post(admBomTypeValidation.create, validationCallback, bomType.create);
router.route('/bom-types').put(admBomTypeValidation.update, validationCallback, bomType.update);
router.route('/bom-types').patch(admBomTypeValidation.patch, validationCallback, bomType.patch);
router.route('/bom-types').delete(admBomTypeValidation.delete, validationCallback, bomType.delete);
//#endregion

//#region ✅ BomType (BOM 투입 유형)
const bomInputType = new AdmBomInputTypeCtl();
router.route('/bom-input-type/:uuid').get(admBomInputTypeValidation.readByUuid, validationCallback, bomInputType.readByUuid);
router.route('/bom-input-types').get(admBomInputTypeValidation.read, validationCallback, bomInputType.read);
router.route('/bom-input-types').post(admBomInputTypeValidation.create, validationCallback, bomInputType.create);
router.route('/bom-input-types').put(admBomInputTypeValidation.update, validationCallback, bomInputType.update);
router.route('/bom-input-types').patch(admBomInputTypeValidation.patch, validationCallback, bomInputType.patch);
router.route('/bom-input-types').delete(admBomInputTypeValidation.delete, validationCallback, bomInputType.delete);
//#endregion

//#region ✅ InspType (검사 유형)
const inspType = new AdmInspTypeCtl();
router.route('/insp-type/:uuid').get(admInspTypeValidation.readByUuid, validationCallback, inspType.readByUuid);
router.route('/insp-types').get(admInspTypeValidation.read, validationCallback, inspType.read);
router.route('/insp-types').post(admInspTypeValidation.create, validationCallback, inspType.create);
router.route('/insp-types').put(admInspTypeValidation.update, validationCallback, inspType.update);
router.route('/insp-types').patch(admInspTypeValidation.patch, validationCallback, inspType.patch);
router.route('/insp-types').delete(admInspTypeValidation.delete, validationCallback, inspType.delete);
//#endregion

//#region ✅ InspHandlingType (검사처리 유형)
const inspHandlingType = new AdmInspHandlingTypeCtl();
router.route('/insp-handling-type/:uuid').get(admInspHandlingTypeValidation.readByUuid, validationCallback, inspHandlingType.readByUuid);
router.route('/insp-handling-types').get(admInspHandlingTypeValidation.read, validationCallback, inspHandlingType.read);
router.route('/insp-handling-types').post(admInspHandlingTypeValidation.create, validationCallback, inspHandlingType.create);
router.route('/insp-handling-types').put(admInspHandlingTypeValidation.update, validationCallback, inspHandlingType.update);
router.route('/insp-handling-types').patch(admInspHandlingTypeValidation.patch, validationCallback, inspHandlingType.patch);
router.route('/insp-handling-types').delete(admInspHandlingTypeValidation.delete, validationCallback, inspHandlingType.delete);
//#endregion

//#region ✅ PrdPlanType (생산계획 유형)
const prdPlanType = new AdmPrdPlanTypeCtl();
router.route('/prd-plan-type/:uuid').get(admPrdPlanTypeValidation.readByUuid, validationCallback, prdPlanType.readByUuid);
router.route('/prd-plan-types').get(admPrdPlanTypeValidation.read, validationCallback, prdPlanType.read);
router.route('/prd-plan-types').post(admPrdPlanTypeValidation.create, validationCallback, prdPlanType.create);
router.route('/prd-plan-types').put(admPrdPlanTypeValidation.update, validationCallback, prdPlanType.update);
router.route('/prd-plan-types').patch(admPrdPlanTypeValidation.patch, validationCallback, prdPlanType.patch);
router.route('/prd-plan-types').delete(admPrdPlanTypeValidation.delete, validationCallback, prdPlanType.delete);
//#endregion

//#region ✅ InspDetailType (세부검사 유형)
const inspDetailType = new AdmInspDetailTypeCtl();
router.route('/insp-detail-type/:uuid').get(admInspDetailTypeValidation.readByUuid, validationCallback, inspDetailType.readByUuid);
router.route('/insp-detail-types').get(admInspDetailTypeValidation.read, validationCallback, inspDetailType.read);
router.route('/insp-detail-types').post(admInspDetailTypeValidation.create, validationCallback, inspDetailType.create);
router.route('/insp-detail-types').put(admInspDetailTypeValidation.update, validationCallback, inspDetailType.update);
router.route('/insp-detail-types').patch(admInspDetailTypeValidation.patch, validationCallback, inspDetailType.patch);
router.route('/insp-detail-types').delete(admInspDetailTypeValidation.delete, validationCallback, inspDetailType.delete);
//#endregion

//#region ✅ TranType (수불 유형)
const tranType = new AdmTransactionCtl();
router.route('/tran-type/:uuid').get(admTranTypeValidation.readByUuid, validationCallback, tranType.readByUuid);
router.route('/tran-types').get(admTranTypeValidation.read, validationCallback, tranType.read);
router.route('/tran-types').post(admTranTypeValidation.create, validationCallback, tranType.create);
router.route('/tran-types').put(admTranTypeValidation.update, validationCallback, tranType.update);
router.route('/tran-types').patch(admTranTypeValidation.patch, validationCallback, tranType.patch);
router.route('/tran-types').delete(admTranTypeValidation.delete, validationCallback, tranType.delete);
//#endregion

//#region ✅ DemandType (요청 유형)
const demandType = new AdmDemandTypeCtl();
router.route('/demand-type/:uuid').get(admDemandTypeValidation.readByUuid, validationCallback, demandType.readByUuid);
router.route('/demand-types').get(admDemandTypeValidation.read, validationCallback, demandType.read);
router.route('/demand-types').post(admDemandTypeValidation.create, validationCallback, demandType.create);
router.route('/demand-types').put(admDemandTypeValidation.update, validationCallback, demandType.update);
router.route('/demand-types').patch(admDemandTypeValidation.patch, validationCallback, demandType.patch);
router.route('/demand-types').delete(admDemandTypeValidation.delete, validationCallback, demandType.delete);
//#endregion

//#region ✅ PatternOpt (자동번호발행 옵션)
const patternOpt = new AdmPatternOptCtl();
router.route('/pattern-opt/:uuid').get(admPatternOptValidation.readByUuid, validationCallback, patternOpt.readByUuid);
router.route('/pattern-opts').get(admPatternOptValidation.read, validationCallback, patternOpt.read);
router.route('/pattern-opts').post(admPatternOptValidation.create, validationCallback, patternOpt.create);
router.route('/pattern-opts').put(admPatternOptValidation.update, validationCallback, patternOpt.update);
router.route('/pattern-opts').patch(admPatternOptValidation.patch, validationCallback, patternOpt.patch);
router.route('/pattern-opts').delete(admPatternOptValidation.delete, validationCallback, patternOpt.delete);
//#endregion

//#region ✅ ReworkType (재작업 유형)
const reworkType = new AdmReworkTypeCtl();
router.route('/rework-type/:uuid').get(admReworkTypeValidation.readByUuid, validationCallback, reworkType.readByUuid);
router.route('/rework-types').get(admReworkTypeValidation.read, validationCallback, reworkType.read);
router.route('/rework-types').post(admReworkTypeValidation.create, validationCallback, reworkType.create);
router.route('/rework-types').put(admReworkTypeValidation.update, validationCallback, reworkType.update);
router.route('/rework-types').patch(admReworkTypeValidation.patch, validationCallback, reworkType.patch);
router.route('/rework-types').delete(admReworkTypeValidation.delete, validationCallback, reworkType.delete);
//#endregion

//#region ✅ StoreType (창고 유형)
const storeType = new AdmStoreTypeCtl();
router.route('/store-type/:uuid').get(admStoreTypeValidation.readByUuid, validationCallback, storeType.readByUuid);
router.route('/store-types').get(admStoreTypeValidation.read, validationCallback, storeType.read);
router.route('/store-types').post(admStoreTypeValidation.create, validationCallback, storeType.create);
router.route('/store-types').put(admStoreTypeValidation.update, validationCallback, storeType.update);
router.route('/store-types').patch(admStoreTypeValidation.patch, validationCallback, storeType.patch);
router.route('/store-types').delete(admStoreTypeValidation.delete, validationCallback, storeType.delete);
//#endregion

//#region ✅ FileMgmtType (파일관리유형)
const fileMgmtType = new AdmFileMgmtTypeCtl();
router.route('/file-mgmt-type/:uuid').get(admFileMgmtTypeValidation.readByUuid, validationCallback, fileMgmtType.readByUuid);
router.route('/file-mgmt-types').get(admFileMgmtTypeValidation.read, validationCallback, fileMgmtType.read);
router.route('/file-mgmt-types').post(admFileMgmtTypeValidation.create, validationCallback, fileMgmtType.create);
router.route('/file-mgmt-types').put(admFileMgmtTypeValidation.update, validationCallback, fileMgmtType.update);
router.route('/file-mgmt-types').patch(admFileMgmtTypeValidation.patch, validationCallback, fileMgmtType.patch);
router.route('/file-mgmt-types').delete(admFileMgmtTypeValidation.delete, validationCallback, fileMgmtType.delete);
//#endregion

//#region ✅ FileMgmtDetailType (파일관리상세유형)
const fileMgmtDetailType = new AdmFileMgmtDetailTypeCtl();
router.route('/file-mgmt-detail-type/:uuid').get(admFileMgmtDetailTypeValidation.readByUuid, validationCallback, fileMgmtDetailType.readByUuid);
router.route('/file-mgmt-detail-types').get(admFileMgmtDetailTypeValidation.read, validationCallback, fileMgmtDetailType.read);
router.route('/file-mgmt-detail-types').post(admFileMgmtDetailTypeValidation.create, validationCallback, fileMgmtDetailType.create);
router.route('/file-mgmt-detail-types').put(admFileMgmtDetailTypeValidation.update, validationCallback, fileMgmtDetailType.update);
router.route('/file-mgmt-detail-types').patch(admFileMgmtDetailTypeValidation.patch, validationCallback, fileMgmtDetailType.patch);
router.route('/file-mgmt-detail-types').delete(admFileMgmtDetailTypeValidation.delete, validationCallback, fileMgmtDetailType.delete);
//#endregion

//#region ✅ FileMgmt (파일관리)
const fileMgmt = new AdmFileMgmtCtl();
router.route('/file-mgmt/:uuid').get(admFileMgmtValidation.readByUuid, validationCallback, fileMgmt.readByUuid);
router.route('/file-mgmts').get(admFileMgmtValidation.read, validationCallback, fileMgmt.read);
router.route('/file-mgmts').post(admFileMgmtValidation.create, validationCallback, fileMgmt.create);
router.route('/file-mgmts').put(admFileMgmtValidation.update, validationCallback, fileMgmt.update);
router.route('/file-mgmts').patch(admFileMgmtValidation.patch, validationCallback, fileMgmt.patch);
router.route('/file-mgmts').delete(admFileMgmtValidation.delete, validationCallback, fileMgmt.delete);
//#endregion

//#region ✅ CompanyOpt (회사 옵션)
const companyOpt = new AdmCompanyOptCtl();
router.route('/company-opt/:uuid').get(admCompanyOptValidation.readByUuid, validationCallback, companyOpt.readByUuid);
router.route('/company-opts').get(admCompanyOptValidation.read, validationCallback, companyOpt.read);
router.route('/company-opts').post(admCompanyOptValidation.create, validationCallback, companyOpt.create);
router.route('/company-opts').put(admCompanyOptValidation.update, validationCallback, companyOpt.update);
router.route('/company-opts').patch(admCompanyOptValidation.patch, validationCallback, companyOpt.patch);
router.route('/company-opts').delete(admCompanyOptValidation.delete, validationCallback, companyOpt.delete);
//#endregion

//#region ✅ CycleUnit (주기단위)
const cycleUnit = new AdmCycleUnitCtl();
router.route('/cycle-unit/:uuid').get(admCycleUnitValidation.readByUuid,validationCallback,cycleUnit.readByUuid);
router.route('/cycle-units').get(admCycleUnitValidation.read,validationCallback,cycleUnit.read);
router.route('/cycle-units').post(admCycleUnitValidation.create,validationCallback,cycleUnit.create);
router.route('/cycle-units').put(admCycleUnitValidation.update,validationCallback,cycleUnit.update);
router.route('/cycle-units').patch(admCycleUnitValidation.patch,validationCallback,cycleUnit.patch);
router.route('/cycle-units').delete(admCycleUnitValidation.delete,validationCallback,cycleUnit.delete);

//#region ✅ DailyInspCycle (일상점검주기)
const dailyInspCycle = new AdmDailyInspCycleCtl();
router.route('/daily-insp-cycle/:uuid').get(admDailyInspCycleValidation.readByUuid, validationCallback, dailyInspCycle.readByUuid);
router.route('/daily-insp-cycles').get(admDailyInspCycleValidation.read, validationCallback, dailyInspCycle.read);
router.route('/daily-insp-cycles').post(admDailyInspCycleValidation.create, validationCallback, dailyInspCycle.create);
router.route('/daily-insp-cycles').put(admDailyInspCycleValidation.update, validationCallback, dailyInspCycle.update);
router.route('/daily-insp-cycles').patch(admDailyInspCycleValidation.patch, validationCallback, dailyInspCycle.patch);
router.route('/daily-insp-cycles').delete(admDailyInspCycleValidation.delete, validationCallback, dailyInspCycle.delete);
//#endregion

export default router;