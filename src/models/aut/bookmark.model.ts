import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Sequelize, Table, Unique, UpdatedAt } from "sequelize-typescript";
import IAutBookmark from "../../interfaces/aut/bookmark.interface";
import AutMenu from "./menu.model";
import AutUser from "./user.model";

@Table({
  tableName: 'AUT_BOOKMARK_TB',
  modelName: 'AutBookmark',
  comment: '즐겨찾기 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class AutBookmark extends Model<IAutBookmark> {
  @Column({
    comment: '즐겨찾기ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false
  })
  bookmark_id: number;

  @ForeignKey(() => AutUser)
  @Column({
    comment: '사용자ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  uid: number;

  @ForeignKey(() => AutMenu)
  @Column({
    comment: '메뉴ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  menu_id: number;

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

  @Unique('aut_bookmark_tb_uuid_un')
  @Column({
    comment: '즐겨찾기UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string;

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


  //#endregion
}