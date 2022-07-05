import * as express from 'express';

import AutGroupPermissionCtl from '../controllers/aut/group-permission.controller';
import AutGroupCtl from '../controllers/aut/group.controller';
import AutMenuTypeCtl from '../controllers/aut/menu-type.controller';
import AutMenuCtl from '../controllers/aut/menu.controller';
import AutPermissionCtl from '../controllers/aut/permission.controller';
import AutUserPermissionCtl from '../controllers/aut/user-permission.controller';
import AutUserCtl from '../controllers/aut/user.controller';

import validationCallback from '../utils/validationCallback';
import AutUserValidation from '../validations/aut/user.validation';
import AutUserPermissionValidation from '../validations/aut/user-permission.validation';
import AutGroupPermissionValidation from '../validations/aut/group-permission.validation';
import AutGroupValidation from '../validations/aut/group.validation';
import AutMenuValidation from '../validations/aut/menu.validation';
import AutMenuTypeValidation from '../validations/aut/menu-type.validation';
import AutPermissionValidation from '../validations/aut/permission.validation';
import AutBookmarkCtl from '../controllers/aut/bookmark.controller';
import autBookmarkValidation from '../validations/aut/bookmark.validation';

const router = express.Router();

//#region ✅ Permission (권한)
const permission = new AutPermissionCtl();
router.route('/permission/:uuid').get(AutPermissionValidation.readByUuid, validationCallback, permission.read);
router.route('/permissions/').get(AutPermissionValidation.read, validationCallback, permission.read);
router.route('/permissions').post(AutPermissionValidation.create, validationCallback, permission.create);
router.route('/permissions').put(AutPermissionValidation.update, validationCallback, permission.update);
router.route('/permissions').patch(AutPermissionValidation.patch, validationCallback, permission.patch);
router.route('/permissions').delete(AutPermissionValidation.delete, validationCallback, permission.delete);
//#endregion

//#region ✅ Group (그룹)
const group = new AutGroupCtl();
router.route('/group/:uuid').get(AutGroupValidation.readByUuid, validationCallback, group.read);
router.route('/groups').get(AutGroupValidation.read, validationCallback, group.read);
router.route('/groups').post(AutGroupValidation.create, validationCallback, group.create);
router.route('/groups').put(AutGroupValidation.update, validationCallback, group.update);
router.route('/groups').patch(AutGroupValidation.patch, validationCallback, group.patch);
router.route('/groups').delete(AutGroupValidation.delete, validationCallback, group.delete);
//#endregion

//#region ✅ GroupPermission (그룹별 메뉴권한)
const groupPermission = new AutGroupPermissionCtl();
router.route('/group-permissions').get(AutGroupPermissionValidation.read,validationCallback,groupPermission.read);
router.route('/group-permissions').put(AutGroupPermissionValidation.update,validationCallback,groupPermission.update);
//#endregion

//#region ✅ Menu (메뉴)
const menu = new AutMenuCtl();
router.route('/menus/permission').get(menu.readMenuWithPermissionByUid);
router.route('/menu/:uuid').get(AutMenuValidation.readByUuid,validationCallback,menu.read);
router.route('/menus/').get(AutMenuValidation.read,validationCallback,menu.read);
router.route('/menus').post(AutMenuValidation.create,validationCallback,menu.create);
router.route('/menus').put(AutMenuValidation.update,validationCallback,menu.update);
router.route('/menus').patch(AutMenuValidation.patch,validationCallback,menu.patch);
router.route('/menus').delete(AutMenuValidation.delete,validationCallback,menu.delete);
//#endregion

//#region ✅ MenuType (메뉴유형)
const menuType = new AutMenuTypeCtl();
router.route('/menu-type/:uuid').get(AutMenuTypeValidation.readByUuid,validationCallback,menuType.read);
router.route('/menu-types/').get(AutMenuTypeValidation.read,validationCallback,menuType.read);
router.route('/menu-types').post(AutMenuTypeValidation.create,validationCallback,menuType.create);
router.route('/menu-types').put(AutMenuTypeValidation.update,validationCallback,menuType.update);
router.route('/menu-types').patch(AutMenuTypeValidation.patch,validationCallback,menuType.patch);
router.route('/menu-types').delete(AutMenuTypeValidation.delete,validationCallback,menuType.delete);
//#endregion

//#region ✅ User (사용자)
const user = new AutUserCtl();
// router.route('/user/sign-in').post(user.signIn);
router.route('/user/sign-in').post(AutUserValidation.signIn, validationCallback,user.signIn);
router.route('/users/pwd').put(AutUserValidation.updatePwd,validationCallback,user.updatePwd);
router.route('/user/:uuid').get(AutUserValidation.readByUuid,validationCallback,user.read);
router.route('/users/').get(AutUserValidation.read,validationCallback,user.read);
router.route('/users').post(AutUserValidation.create,validationCallback,user.create);
router.route('/users').put(AutUserValidation.update,validationCallback,user.update);
router.route('/users').patch(AutUserValidation.patch,validationCallback,user.patch);
router.route('/users').delete(AutUserValidation.delete,validationCallback,user.delete);
//#endregion

//#region ✅ UserPermission (사용자별 메뉴권한)
const userPermission = new AutUserPermissionCtl();
router.route('/user-permissions').get(AutUserPermissionValidation.read,validationCallback,userPermission.read);
router.route('/user-permissions').put(AutUserPermissionValidation.update,validationCallback,userPermission.update);
//#endregion

//#region ✅ Bookmark (사용자별 즐겨찾기)
const bookmark = new AutBookmarkCtl();
router.route('/bookmark/:uuid').get(autBookmarkValidation.readByUuid, validationCallback, bookmark.readByUuid);
router.route('/bookmarks').get(autBookmarkValidation.read, validationCallback, bookmark.read);
router.route('/bookmarks').post(autBookmarkValidation.create, validationCallback, bookmark.create);
router.route('/bookmarks').delete(autBookmarkValidation.delete, validationCallback, bookmark.delete);
router.route('/bookmark/by-menu').delete(autBookmarkValidation.deleteByMenuUuid, validationCallback, bookmark.deleteByMenuUuid);
//#endregion

export default router;