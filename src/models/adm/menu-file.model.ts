import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Sequelize, Table, Unique, UpdatedAt } from "sequelize-typescript";
import IAdmMenuFile from "../../interfaces/adm/menu-file.interface";
import AutMenu from "../aut/menu.model";
import AutUser from "../aut/user.model";

@Table({
  tableName: 'ADM_MENU_FILE_TB',
  modelName: 'AdmMenuFile',
  comment: '메뉴별 파일 정보',
  timestamps: false,
  underscored: true,
})
export default class AdmMenuFile extends Model<IAdmMenuFile> {
  @Column({
    comment: '메뉴별 파일정보 ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false
  })
  menu_file_id: number;

  @ForeignKey(() => AutMenu)
  @Column({
    comment: '메뉴ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  menu_id: number;

  @Column({
    comment: '파일 타입',
    type: DataType.STRING(25),
    allowNull: false,
  })
  file_type: string;

  @Column({
    comment: '파일명',
    type: DataType.STRING(100),
    allowNull: false,
  })
  file_name: string;

  @Column({
    comment: '파일 확장자',
    type: DataType.STRING(25),
    allowNull: false,
  })
  file_extension: string;

  @Column({
    comment: '사용여부',
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

  @Unique('adm_menu_file_tb_uuid_key')
  @Column({
    comment: '메뉴별 파일관리UUID',
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

  @BelongsTo(() => AutMenu, { foreignKey: 'menu_id', targetKey: 'menu_id', onDelete: 'restrict', onUpdate: 'cascade' })
  autMenu: AutMenu;

  //#endregion
}