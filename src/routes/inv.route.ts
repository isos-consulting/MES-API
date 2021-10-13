import * as express from 'express';

import InvStoreCtl from '../controllers/inv/store.controller';
import InvStockRejectCtl from '../controllers/inv/stock-reject.controller';
import InvMoveCtl from '../controllers/inv/move.controller';

const router = express.Router();

//#region ✅ Store (재고관리/실사)
const store = new InvStoreCtl();
router.route('/stores/total-history').get(store.readTotalHistory);
router.route('/stores/individual-history').get(store.readIndividualHistory);
router.route('/stores/type-history').get(store.readTypeHistory);
router.route('/stores/history-by-transaction').get(store.readStoreHistoryByTransaction);
router.route('/stores/stocks/return').get(store.readReturnStock);
router.route('/stores/stocks').get(store.readStock);
router.route('/store/:uuid').get(store.read);
router.route('/stores').get(store.read);
router.route('/stores').post(store.create);
router.route('/stores').put(store.update);
router.route('/stores').patch(store.patch);
router.route('/stores').delete(store.delete);
//#endregion

//#region ✅ StockReject (재고부적합)
const stockReject = new InvStockRejectCtl();
router.route('/stock-reject/:uuid').get(stockReject.read);
router.route('/stock-rejects').get(stockReject.read);
router.route('/stock-rejects').post(stockReject.create);
router.route('/stock-rejects').put(stockReject.update);
router.route('/stock-rejects').patch(stockReject.patch);
router.route('/stock-rejects').delete(stockReject.delete);
//#endregion

//#region ✅ Move (재고이동)
const move = new InvMoveCtl();
router.route('/move/:uuid').get(move.read);
router.route('/moves').get(move.read);
router.route('/moves').post(move.create);
router.route('/moves').put(move.update);
router.route('/moves').patch(move.patch);
router.route('/moves').delete(move.delete);
//#endregion

export default router;