import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, Sequelize, ForeignKey } from 'sequelize-typescript'
import IAutMenu from '../../interfaces/aut/menu.interface';
import AutMenuType from './menu-type.model';
import AutUser from './user.model';

@Table({
  tableName: 'AUT_MENU_TB',
  modelName: 'AutMenu',
  comment: '메뉴 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class AutMenu extends Model<IAutMenu> {
  @Column({
    comment: '메뉴ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  menu_id: number;

  @ForeignKey(() => AutMenuType)
  @Column({
    comment: '메뉴 유형ID',
    type: DataType.INTEGER,
  })
  menu_type_id: number;

  @Column({
    comment: '메뉴명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  menu_nm: string;

  @Column({
    comment: '메뉴 URI (API EndPoint)',
    type: DataType.STRING(250),
  })
  menu_uri: string;

  // 지우고 싶은거 1순위
  @Column({
    comment: '메뉴 Form 명 (VB Form Name)',
    type: DataType.STRING(250),
  })
  menu_form_nm: string;

  @Column({
    comment: '메뉴 컴포넌트명',
    type: DataType.STRING(50),
  })
  component_nm: string;

  @Column({
    comment: '메뉴 아이콘 파일명',
    type: DataType.STRING(50),
  })
  icon: string;

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
    comment: '메뉴 사용 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  use_fg: boolean;

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

  @Unique('aut_menu_tb_uuid_un')
  @Column({
    comment: '메뉴UUID',
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

  @BelongsTo(() => AutMenuType, { foreignKey: 'menu_type_id', targetKey: 'menu_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  autMenuType: AutMenuType;

  @BelongsTo(() => AutMenu, { as: 'parent', foreignKey: 'parent_id', targetKey: 'menu_id', constraints: false })
  parent: AutMenu;

  //#endregion
}