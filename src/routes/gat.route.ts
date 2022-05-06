import * as express from 'express';
import GatDataHistoryCtl from '../controllers/gat/data-history.controller';
import StdDataItemCtl from '../controllers/gat/data-item.controller';
import StdDataGearCtl from '../controllers/gat/data-gear.controller';
import StdDataMapCtl from '../controllers/gat/data-map.controller';

import validationCallback from '../utils/validationCallback';
import gatDataHistoryValidation from '../validations/gat/data-history.validation';
import gatDataItemValidation from '../validations/gat/data-item.validation';
import gatDataGearValidation from '../validations/gat/data-gear.validation';
import gatDataMapValidation from '../validations/gat/data-map.validation';

const router = express.Router();

//#region ✅ 게더링 데이터 (GatDataHistory)
const dataHistory = new GatDataHistoryCtl();
router.route('/data-history/report').get(gatDataHistoryValidation.readTempGraph,validationCallback,dataHistory.readTempGraph);
//#endregion

//#region ✅ DataItem (인터페이서 항목)
const dataItem = new StdDataItemCtl();
router.route('/data-item/:uuid').get(gatDataItemValidation.readByUuid, validationCallback, dataItem.readByUuid);
router.route('/data-items').get(gatDataItemValidation.read, validationCallback, dataItem.read);
router.route('/data-items').post(gatDataItemValidation.create, validationCallback, dataItem.create);
router.route('/data-items').put(gatDataItemValidation.update, validationCallback, dataItem.update);
router.route('/data-items').patch(gatDataItemValidation.patch, validationCallback, dataItem.patch);
router.route('/data-items').delete(gatDataItemValidation.delete, validationCallback, dataItem.delete);
//#endregion

//#region ✅ DataGear (인터페이스 장비)
const dataGear = new StdDataGearCtl();
router.route('/data-gear/:uuid').get(gatDataGearValidation.readByUuid, validationCallback, dataGear.readByUuid);
router.route('/data-gears').get(gatDataGearValidation.read, validationCallback, dataGear.read);
router.route('/data-gears').post(gatDataGearValidation.create, validationCallback, dataGear.create);
router.route('/data-gears').put(gatDataGearValidation.update, validationCallback, dataGear.update);
router.route('/data-gears').patch(gatDataGearValidation.patch, validationCallback, dataGear.patch);
router.route('/data-gears').delete(gatDataGearValidation.delete, validationCallback, dataGear.delete);
//#endregion

//#region ✅ DataMap (인터페이스 매핑)
const dataMap = new StdDataMapCtl();
router.route('/data-map/:uuid').get(gatDataMapValidation.readByUuid, validationCallback, dataMap.readByUuid);
router.route('/data-maps/equip').get(gatDataMapValidation.readEquip, validationCallback, dataMap.readEquip);
router.route('/data-maps').get(gatDataMapValidation.read, validationCallback, dataMap.read);
router.route('/data-maps').post(gatDataMapValidation.create, validationCallback, dataMap.create);
router.route('/data-maps').put(gatDataMapValidation.update, validationCallback, dataMap.update);
router.route('/data-maps').patch(gatDataMapValidation.patch, validationCallback, dataMap.patch);
router.route('/data-maps').delete(gatDataMapValidation.delete, validationCallback, dataMap.delete);
//#endregion

export default router;