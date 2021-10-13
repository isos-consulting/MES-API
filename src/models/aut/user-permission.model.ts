import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, Sequelize, ForeignKey } from 'sequelize-typescript'
import IAutUserPermission from '../../interfaces/aut/user-permission.interface';
import AutMenu from './menu.model';
import AutPermission from './permission.model';
import AutUser from './user.model';

@Table({
  tableName: 'AUT_USER_PERMISSION_TB',
  modelName: 'AutUserPermission',
  comment: '사용자별 메뉴 권한 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class AutUserPermission extends Model<IAutUserPermission> {
  @Column({
    comment: '사용자별 메뉴 권한ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_permission_id: number;
  
  @Unique('aut_user_permission_tb_uid_menu_id_un')
  @ForeignKey(() => AutUser)
  @Column({
    comment: '사용자ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  uid: number;
  
  @Unique('aut_user_permission_tb_uid_menu_id_un')
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

  @Unique('aut_user_permission_tb_uuid_un')
  @Column({
    comment: '사용자별 메뉴 권한UUID',
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

  @BelongsTo(() => AutUser, { as: 'autUser', foreignKey: 'uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  autUser: AutUser;

  @BelongsTo(() => AutMenu, { foreignKey: 'menu_id', targetKey: 'menu_id', onDelete: 'restrict', onUpdate: 'cascade' })
  autMenu: AutMenu;

  @BelongsTo(() => AutPermission, { foreignKey: 'permission_id', targetKey: 'permission_id', onDelete: 'restrict', onUpdate: 'cascade' })
  autPermission: AutPermission;

  //#endregion
}