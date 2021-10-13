import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdInspItemType from '../../interfaces/std/insp-item-type.interface';
import AutUser from '../aut/user.model';
import StdFactory from './factory.model';

@Table({
  tableName: 'STD_INSP_ITEM_TYPE_TB',
  modelName: 'StdInspItemType',
  comment: '검사 유형 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdInspItemType extends Model<IStdInspItemType> {
  @Column({
    comment: '검사 유형ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_item_type_id: number;

  @Unique('std_insp_item_type_tb_factory_id_insp_item_type_cd_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('std_insp_item_type_tb_factory_id_insp_item_type_cd_un')
  @Column({
    comment: '검사 유형코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  insp_item_type_cd: string;

  @Column({
    comment: '검사 유형명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  insp_item_type_nm: string;

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

  @Unique('std_insp_item_type_tb_uuid_un')
  @Column({
    comment: '검사 유형UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string

  //#region ✅ Define Association
  // BelongTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  updateUser: AutUser;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  // HasMany
  //#endregion
}