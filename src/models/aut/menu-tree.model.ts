import { Table, Column, Model, DataType, BelongsTo } from 'sequelize-typescript'
import IAutMenuTree from '../../interfaces/aut/menu-tree.interface';
import AutGroupPermission from './group-permission.model';
import AutMenuType from './menu-type.model';
import AutMenu from './menu.model';
import AutUserPermission from './user-permission.model';

@Table({
  tableName: 'AUT_MENU_TREE_VW',
  modelName: 'AutMenuTree',
  comment: '메뉴(트리)정보 뷰',
  underscored: true
})
export default class AutMenuTree extends Model<IAutMenuTree> {
  @Column({
    comment: '메뉴ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  menu_id: number;

  @Column({
    comment: '메뉴 Level',
    type: DataType.INTEGER,
    allowNull: false,
  })
  lv: number;

  @Column({
    comment: '메뉴 유형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  menu_type_id: number;

  @Column({
    comment: '부모 메뉴ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  parent_id: number;

  @Column({
    comment: '정렬',
    type: DataType.INTEGER,
    allowNull: false,
  })
  sortby: number;

  @Column({
    comment: '1Level 메뉴ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  first_menu_id: number;

  //#region ✅ Define Association
  // BelongsTo
  @BelongsTo(() => AutMenu, { as: 'autMenu', foreignKey: 'menu_id', targetKey: 'menu_id', constraints: false })
  autMenu: AutMenu;

  @BelongsTo(() => AutMenuType, { foreignKey: 'menu_type_id', targetKey: 'menu_type_id', constraints: false })
  autMenuType: AutMenuType;

  @BelongsTo(() => AutMenu, { as: 'parentMenu', foreignKey: 'parent_id', targetKey: 'menu_id', constraints: false })
  parentMenu: AutMenu;

  @BelongsTo(() => AutMenu, { as: 'firstMenu', foreignKey: 'first_menu_id', targetKey: 'menu_id', constraints: false })
  firstMenu: AutMenu;

  @BelongsTo(() => AutUserPermission, { foreignKey: 'menu_id', targetKey: 'menu_id', constraints: false })
  autUserPermission: AutUserPermission;

  @BelongsTo(() => AutGroupPermission, { foreignKey: 'menu_id', targetKey: 'menu_id', constraints: false })
  autGroupPermission: AutGroupPermission;
  //#endregion
}