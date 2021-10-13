import * as express from 'express';

import AutGroupPermissionCtl from '../controllers/aut/group-permission.controller';
import AutGroupCtl from '../controllers/aut/group.controller';
import AutMenuTypeCtl from '../controllers/aut/menu-type.controller';
import AutMenuCtl from '../controllers/aut/menu.controller';
import AutPermissionCtl from '../controllers/aut/permission.controller';
import AutUserPermissionCtl from '../controllers/aut/user-permission.controller';
import AutUserCtl from '../controllers/aut/user.controller';

const router = express.Router();

//#region ✅ Permission (권한)
const permission = new AutPermissionCtl();
router.route('/permission/:uuid').get(permission.read);
router.route('/permissions/').get(permission.read);
router.route('/permissions').post(permission.create);
router.route('/permissions').put(permission.update);
router.route('/permissions').patch(permission.patch);
router.route('/permissions').delete(permission.delete);
//#endregion

//#region ✅ Group (그룹)
const group = new AutGroupCtl();
router.route('/group/:uuid').get(group.read);
router.route('/groups').get(group.read);
router.route('/groups').post(group.create);
router.route('/groups').put(group.update);
router.route('/groups').patch(group.patch);
router.route('/groups').delete(group.delete);
//#endregion

//#region ✅ GroupPermission (그룹별 메뉴권한)
const groupPermission = new AutGroupPermissionCtl();
router.route('/group-permissions').get(groupPermission.read);
router.route('/group-permissions').put(groupPermission.update);
//#endregion

//#region ✅ Menu (메뉴)
const menu = new AutMenuCtl();
router.route('/menus/permission').get(menu.readMenuWithPermissionByUid);
router.route('/menu/:uuid').get(menu.read);
router.route('/menus/').get(menu.read);
router.route('/menus').post(menu.create);
router.route('/menus').put(menu.update);
router.route('/menus').patch(menu.patch);
router.route('/menus').delete(menu.delete);
//#endregion

//#region ✅ MenuType (메뉴유형)
const menuType = new AutMenuTypeCtl();
router.route('/menu-type/:uuid').get(menuType.read);
router.route('/menu-types/').get(menuType.read);
router.route('/menu-types').post(menuType.create);
router.route('/menu-types').put(menuType.update);
router.route('/menu-types').patch(menuType.patch);
router.route('/menu-types').delete(menuType.delete);
//#endregion

//#region ✅ User (사용자)
const user = new AutUserCtl();
router.route('/user/sign-in').post(user.signIn);
router.route('/users/pwd').put(user.updatePwd);
router.route('/user/:uuid').get(user.read);
router.route('/users/').get(user.read);
router.route('/users').post(user.create);
router.route('/users').put(user.update);
router.route('/users').patch(user.patch);
router.route('/users').delete(user.delete);
//#endregion

//#region ✅ UserPermission (사용자별 메뉴권한)
const userPermission = new AutUserPermissionCtl();
router.route('/user-permissions').get(userPermission.read);
router.route('/user-permissions').put(userPermission.update);
//#endregion

export default router;