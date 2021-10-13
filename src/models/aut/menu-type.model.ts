import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, Sequelize } from 'sequelize-typescript'
import IAutMenuType from '../../interfaces/aut/menu-type.interface';
import AutUser from './user.model';

@Table({
  tableName: 'AUT_MENU_TYPE_TB',
  modelName: 'AutMenuType',
  comment: '메뉴 유형 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class AutMenuType extends Model<IAutMenuType> {
  @Column({
    comment: '메뉴 유형ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  menu_type_id: number;

  @Unique('aut_menu_type_tb_menu_type_nm_un')
  @Column({
    comment: '메뉴 유형명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  menu_type_nm: string;

  @Column({
    comment: '데이터 생성 가능 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  create_fg: boolean;

  @Column({
    comment: '데이터 조회 가능 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  read_fg: boolean;

  @Column({
    comment: '데이터 수정 가능 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  update_fg: boolean;

  @Column({
    comment: '데이터 삭제 가능 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  delete_fg: boolean;

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

  @Unique('aut_menu_type_tb_uuid_un')
  @Column({
    comment: '메뉴 유형UUID',
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

  //#endregion
}