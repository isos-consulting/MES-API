import * as express from 'express';
import GatDataHistoryCtl from '../controllers/gat/data-history.controller';
import validationCallback from '../utils/validationCallback';
import gatDataHistoryValidation from '../validations/gat/data-history.validation';

const router = express.Router();

//#region ✅ 게더링 데이터 (GatDataHistory)
const dataHistory = new GatDataHistoryCtl();
router.route('/data-history/report').get(gatDataHistoryValidation.readTempGraph,validationCallback,dataHistory.readTempGraph);

//#endregion

export default router;