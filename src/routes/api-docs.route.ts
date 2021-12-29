import * as express from 'express';
import * as redoc from 'redoc-express';

const router = express.Router();

//#region ✅ Adm (Admin: 관리자)
router.route('/adm.swagger.yaml').get((req, res) => {
  res.sendFile('adm.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/adm').get(redoc.default({
  title: 'API Docs - Adm(관리자)',
  specUrl: 'adm.swagger.yaml'
}));
//#endregion

//#region ✅ Aut (Authorization: 권한/인증)
router.route('/aut.swagger.yaml').get((req, res) => {
  res.sendFile('aut.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/aut').get(redoc.default({
  title: 'API Docs - Aut(권한/인증)',
  specUrl: 'aut.swagger.yaml'
}));
//#endregion

//#region ✅ Das (Dashboard: 대시보드)
router.route('/das.swagger.yaml').get((req, res) => {
  res.sendFile('das.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/das').get(redoc.default({
  title: 'API Docs - Das(대시보드)',
  specUrl: 'das.swagger.yaml'
}));
//#endregion

//#region ✅ Std (Standard: 기준정보)
router.route('/std.swagger.yaml').get((req, res) => {
  res.sendFile('std.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/std').get(redoc.default({
  title: 'API Docs - STD(기준정보)',
  specUrl: 'std.swagger.yaml'
}));
//#endregion

//#region ✅ Mat (Material: 자재/구매)
router.route('/mat.swagger.yaml').get((req, res) => {
  res.sendFile('mat.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/mat').get(redoc.default({
  title: 'API Docs - MAT(자재구매)',
  specUrl: 'mat.swagger.yaml'
}));
//#endregion

//#region ✅ Sal (Sales: 제품/영업)
router.route('/sal.swagger.yaml').get((req, res) => {
  res.sendFile('sal.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/sal').get(redoc.default({
  title: 'API Docs - SAL(제품영업)',
  specUrl: 'sal.swagger.yaml'
}));
//#endregion

//#region ✅ Inv (Inventory: 창고/재고)
router.route('/inv.swagger.yaml').get((req, res) => {
  res.sendFile('inv.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/inv').get(redoc.default({
  title: 'API Docs - INV(창고재고)',
  specUrl: 'inv.swagger.yaml'
}));
//#endregion

//#region ✅ Prd (Production: 생산)
router.route('/prd.swagger.yaml').get((req, res) => {
  res.sendFile('prd.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/prd').get(redoc.default({
  title: 'API Docs - Prd(생산)',
  specUrl: 'prd.swagger.yaml'
}));
//#endregion

//#region ✅ Out (Outsourcing: 외주)
router.route('/out.swagger.yaml').get((req, res) => {
  res.sendFile('out.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/out').get(redoc.default({
  title: 'API Docs - Out(외주)',
  specUrl: 'out.swagger.yaml'
}));
//#endregion

//#region ✅ Qms (Quality Management Systems: 품질)
router.route('/qms.swagger.yaml').get((req, res) => {
  res.sendFile('qms.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/qms').get(redoc.default({
  title: 'API Docs - Qms(품질)',
  specUrl: 'qms.swagger.yaml'
}));
//#endregion

//#region ✅ Mld (Mold: 금형)
router.route('/mld.swagger.yaml').get((req, res) => {
  res.sendFile('mld.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/mld').get(redoc.default({
  title: 'API Docs - Mld(금형)',
  specUrl: 'mld.swagger.yaml'
}));

//#region ✅ Eqm (Equipment: 금형)
router.route('/eqm.swagger.yaml').get((req, res) => {
  res.sendFile('eqm.swagger.build.yaml', { root: './swaggers/builds' });
});
router.route('/eqm').get(redoc.default({
  title: 'API Docs - Eqm(설비)',
  specUrl: 'eqm.swagger.yaml'
}));
//#endregion

export default router;