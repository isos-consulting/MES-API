import * as express from 'express';

import OutReceiveDetailCtl from '../controllers/out/receive-detail.controller';
import OutReceiveCtl from '../controllers/out/receive.controller';
import OutReleaseDetailCtl from '../controllers/out/release-detail.controller';
import OutReleaseCtl from '../controllers/out/release.controller';

const router = express.Router();

//#region ✅ Receive (외주입하)
const receive = new OutReceiveCtl();
router.route('/receives/report').get(receive.readReport);
router.route('/receive/:uuid').get(receive.read);
router.route('/receive/:uuid/include-details').get(receive.readIncludeDetails);
router.route('/receive/:uuid/details').get(receive.readDetails);
router.route('/receives').get(receive.read);
router.route('/receives').post(receive.create);
router.route('/receives').put(receive.update);
router.route('/receives').patch(receive.patch);
router.route('/receives').delete(receive.delete);
//#endregion

//#region ✅ ReceiveDetail (외주입하상세)
const receiveDetail = new OutReceiveDetailCtl();
router.route('/receive-detail/:uuid').get(receiveDetail.read);
router.route('/receive-details').get(receiveDetail.read);
//#endregion

//#region ✅ Release (외주출고)
const release = new OutReleaseCtl();
router.route('/releases/report').get(release.readReport);
router.route('/release/:uuid').get(release.read);
router.route('/release/:uuid/include-details').get(release.readIncludeDetails);
router.route('/release/:uuid/details').get(release.readDetails);
router.route('/releases').get(release.read);
router.route('/releases').post(release.create);
router.route('/releases').put(release.update);
router.route('/releases').patch(release.patch);
router.route('/releases').delete(release.delete);
//#endregion

//#region ✅ ReleaseDetail (외주출고상세)
const releaseDetail = new OutReleaseDetailCtl();
router.route('/release-detail/:uuid').get(releaseDetail.read);
router.route('/release-details').get(releaseDetail.read);
//#endregion

export default router;