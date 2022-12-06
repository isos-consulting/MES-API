import * as express from 'express';

import InvStoreCtl from '../controllers/inv/store.controller';
import InvStockRejectCtl from '../controllers/inv/stock-reject.controller';
import InvMoveCtl from '../controllers/inv/move.controller';
import invMoveValidation from '../validations/inv/move.validation';
import validationCallback from '../utils/validationCallback';
import invStockRejectValidation from '../validations/inv/stock-reject.validation';
import invStoreValidation from '../validations/inv/store.validation';
import InvEcerpCtl from '../controllers/inv/ecerp.controller';
import invEcerpValidation from '../validations/inv/ecerp.validation';

const router = express.Router();

//#region ✅ Store (재고관리/실사)
const store = new InvStoreCtl();
router.route('/stores/total-history').get(invStoreValidation.readTotalHistory, validationCallback, store.readTotalHistory);
router.route('/stores/individual-history').get(invStoreValidation.readIndividualHistory, validationCallback, store.readIndividualHistory);
router.route('/stores/type-history').get(invStoreValidation.readTypeHistory, validationCallback, store.readTypeHistory);
router.route('/stores/history-by-transaction').get(invStoreValidation.readStoreHistoryByTransaction, validationCallback, store.readStoreHistoryByTransaction);
router.route('/stores/stocks/return').get(invStoreValidation.readReturnStock, validationCallback, store.readReturnStock);
router.route('/stores/stocks').get(invStoreValidation.readStock, validationCallback, store.readStock);
router.route('/store/:uuid').get(invStoreValidation.read, validationCallback, store.read);
router.route('/stores').get(invStoreValidation.read, validationCallback, store.read);
router.route('/stores').post(invStoreValidation.create, validationCallback, store.create);
router.route('/stores').put(invStoreValidation.update, validationCallback, store.update);
router.route('/stores').patch(invStoreValidation.patch, validationCallback, store.patch);
router.route('/stores').delete(invStoreValidation.delete, validationCallback, store.delete);
//#endregion

//#region ✅ StockReject (재고부적합)
const stockReject = new InvStockRejectCtl();
router.route('/stock-reject/:uuid').get(invStockRejectValidation.readByUuid, validationCallback, stockReject.readByUuid);
router.route('/stock-rejects').get(invStockRejectValidation.read, validationCallback, stockReject.read);
router.route('/stock-rejects').post(invStockRejectValidation.create, validationCallback, stockReject.create);
router.route('/stock-rejects').put(invStockRejectValidation.update, validationCallback, stockReject.update);
router.route('/stock-rejects').patch(invStockRejectValidation.patch, validationCallback, stockReject.patch);
router.route('/stock-rejects').delete(invStockRejectValidation.delete, validationCallback, stockReject.delete);
//#endregion

//#region ✅ Move (재고이동)
const move = new InvMoveCtl();
router.route('/move/:uuid').get(invMoveValidation.readByUuid, validationCallback, move.readByUuid);
router.route('/moves').get(invMoveValidation.read, validationCallback, move.read);
router.route('/moves').post(invMoveValidation.create, validationCallback, move.create);
router.route('/moves').put(invMoveValidation.update, validationCallback, move.update);
router.route('/moves').patch(invMoveValidation.patch, validationCallback, move.patch);
router.route('/moves').delete(invMoveValidation.delete, validationCallback, move.delete);
//#endregion

//#region ✅ ECERP (ERP 연동)
const ecerp = new InvEcerpCtl();
router.route('/ecerp/:uuid').get(invEcerpValidation.readByUuid, validationCallback, ecerp.readByUuid);
router.route('/ecerps').get(invEcerpValidation.read, validationCallback, ecerp.read);
router.route('/ecerps/mat-receive').get(invEcerpValidation.readMatReceive, validationCallback, ecerp.readMatReceive);
router.route('/ecerps/sal-outgo').get(invEcerpValidation.readSalOutgo, validationCallback, ecerp.readSalOutgo);
router.route('/ecerps').post(invEcerpValidation.create, validationCallback, ecerp.create);
router.route('/ecerps').put(invEcerpValidation.update, validationCallback, ecerp.update);
router.route('/ecerps').patch(invEcerpValidation.patch, validationCallback, ecerp.patch);
router.route('/ecerps').delete(invEcerpValidation.delete, validationCallback, ecerp.delete);
//#endregion

export default router;