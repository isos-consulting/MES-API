import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey, HasMany, Unique, Sequelize } from 'sequelize-typescript'
import IStdRejectType  from '../../interfaces/std/reject-type.interface';
import AutUser from '../aut/user.model';
import StdFactory from './factory.model';
import StdReject from './reject.model';

@Table({
  tableName: 'STD_REJECT_TYPE_TB',
  modelName: 'StdRejectType',
  comment: '부적합유형 정보 테이블',
  timestamps: true,
  underscored: true
})
export default class StdRejectType extends Model<IStdRejectType> {
  @Column({
    comment: '부적합유형ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  reject_type_id: number;

  @Unique('std_reject_type_tb_factory_id_reject_type_cd_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false
  })
  factory_id: number;

  @Unique('std_reject_type_tb_factory_id_reject_type_cd_un')
  @Column({
    comment: '부적합유형코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  reject_type_cd: string;

  @Column({
    comment: '부적합유형명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  reject_type_nm: string;

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

  @Unique('std_reject_type_tb_uuid_un')
  @Column({
    comment: '부적합 유형UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string

  //#region ✅ Define Association
  // HasMany
  @HasMany(() => StdReject, { foreignKey: 'reject_type_id' })
  stdReject: StdReject;

  // BelongsTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  updateUser: AutUser;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;
  //#endregion
}