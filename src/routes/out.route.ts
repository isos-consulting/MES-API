import * as express from 'express';

import OutReceiveDetailCtl from '../controllers/out/receive-detail.controller';
import OutReceiveCtl from '../controllers/out/receive.controller';
import OutReleaseDetailCtl from '../controllers/out/release-detail.controller';
import OutReleaseCtl from '../controllers/out/release.controller';
import validationCallback from '../utils/validationCallback';
import outReceiveDetailValidation from '../validations/out/receive-detail.validation';
import outReceiveValidation from '../validations/out/receive.validation';
import outReleaseDetailValidation from '../validations/out/release-detail.validation';
import outReleaseValidation from '../validations/out/release.validation';

const router = express.Router();

//#region ✅ Receive (외주입하)
const receive = new OutReceiveCtl();
router.route('/receives/report').get(outReceiveValidation.readReport, validationCallback, receive.readReport);
router.route('/receive/:uuid').get(outReceiveValidation.readByUuid, validationCallback, receive.readByUuid);
router.route('/receive/:uuid/include-details').get(outReceiveValidation.readIncludeDetails, validationCallback, receive.readIncludeDetails);
router.route('/receive/:uuid/details').get(outReceiveValidation.readDetails, validationCallback, receive.readDetails);
router.route('/receives').get(outReceiveValidation.read, validationCallback, receive.read);
router.route('/receives').post(outReceiveValidation.create, validationCallback, receive.create);
router.route('/receives').put(outReceiveValidation.update, validationCallback, receive.update);
router.route('/receives').patch(outReceiveValidation.patch, validationCallback, receive.patch);
router.route('/receives').delete(outReceiveValidation.delete, validationCallback, receive.delete);
//#endregion

//#region ✅ ReceiveDetail (외주입하상세)
const receiveDetail = new OutReceiveDetailCtl();
router.route('/receive-detail/:uuid').get(outReceiveDetailValidation.readByUuid, validationCallback, receiveDetail.readByUuid);
router.route('/receive-details').get(outReceiveDetailValidation.read, validationCallback, receiveDetail.read);
//#endregion

//#region ✅ Release (외주출고)
const release = new OutReleaseCtl();
router.route('/releases/report').get(outReleaseValidation.readReport, validationCallback, release.readReport);
router.route('/release/:uuid').get(outReleaseValidation.readByUuid, validationCallback, release.readByUuid);
router.route('/release/:uuid/include-details').get(outReleaseValidation.readIncludeDetails, validationCallback, release.readIncludeDetails);
router.route('/release/:uuid/details').get(outReleaseValidation.readDetails, validationCallback, release.readDetails);
router.route('/releases').get(outReleaseValidation.read, validationCallback, release.read);
router.route('/releases').post(outReleaseValidation.create, validationCallback, release.create);
router.route('/releases').put(outReleaseValidation.update, validationCallback, release.update);
router.route('/releases').patch(outReleaseValidation.patch, validationCallback, release.patch);
router.route('/releases').delete(outReleaseValidation.delete, validationCallback, release.delete);
//#endregion

//#region ✅ ReleaseDetail (외주출고상세)
const releaseDetail = new OutReleaseDetailCtl();
router.route('/release-detail/:uuid').get(outReleaseDetailValidation.readByUuid, validationCallback, releaseDetail.readByUuid);
router.route('/release-details').get(outReleaseDetailValidation.read, validationCallback, releaseDetail.read);
//#endregion


export default router;