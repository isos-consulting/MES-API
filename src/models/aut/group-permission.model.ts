import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, Sequelize, ForeignKey } from 'sequelize-typescript'
import IAutGroupPermission from '../../interfaces/aut/group-permission.interface';
import AutGroup from './group.model';
import AutMenu from './menu.model';
import AutPermission from './permission.model';
import AutUser from './user.model';

@Table({
  tableName: 'AUT_GROUP_PERMISSION_TB',
  modelName: 'AutGroupPermission',
  comment: '그룹별 메뉴 권한 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class AutGroupPermission extends Model<IAutGroupPermission> {
  @Column({
    comment: '그룹별 메뉴 권한ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  group_permission_id: number;
  
  @Unique('aut_group_permission_tb_group_id_menu_id_un')
  @ForeignKey(() => AutGroup)
  @Column({
    comment: '그룹ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  group_id: number;
  
  @Unique('aut_group_permission_tb_group_id_menu_id_un')
  @ForeignKey(() => AutMenu)
  @Column({
    comment: '메뉴ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  menu_id: number;
  
  @ForeignKey(() => AutPermission)
  @Column({
    comment: '권한ID',
    type: DataType.INTEGER,
  })
  permission_id: number;

  @CreatedAt
  @Column({
    comment: '데이터 생성 일시',
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('now')
  })
  created_at: Date;
  
  @Column({
    comment: '데이터 생성자 UID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  created_uid: number;

  @UpdatedAt
  @Column({
    comment: '데이터 수정 일시',
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('now')
  })
  updated_at: Date;

  @Column({
    comment: '데이터 수정자 UID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  updated_uid: number;

  @Unique('aut_group_permission_tb_uuid_un')
  @Column({
    comment: '그룹별 메뉴 권한UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string

  //#region ✅ Define Association
  // BelongsTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  updateUser: AutUser;

  @BelongsTo(() => AutGroup, { foreignKey: 'group_id', targetKey: 'group_id', onDelete: 'restrict', onUpdate: 'cascade' })
  autGroup: AutGroup;

  @BelongsTo(() => AutMenu, { foreignKey: 'menu_id', targetKey: 'menu_id', onDelete: 'restrict', onUpdate: 'cascade' })
  autMenu: AutMenu;

  @BelongsTo(() => AutPermission, { foreignKey: 'permission_id', targetKey: 'permission_id', onDelete: 'restrict', onUpdate: 'cascade' })
  autPermission: AutPermission;

  //#endregion
}