import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey, HasMany, Unique, Sequelize } from 'sequelize-typescript'
import IStdReject from '../../interfaces/std/reject.interface';
import StdFactory from './factory.model';
import StdRejectType from './reject-type.model';
import StdProcReject from './proc-reject.model';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'STD_REJECT_TB',
  modelName: 'StdReject',
  comment: '부적합 정보 테이블',
  timestamps: true,
  underscored: true
})
export default class StdReject extends Model<IStdReject> {
  @Column({
    comment: '부적합ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  reject_id: number;

  @Unique('std_reject_tb_factory_id_reject_cd_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false
  })
  factory_id: number;

  @ForeignKey(() => StdRejectType)
  @Column({
    comment: '부적합유형ID',
    type: DataType.INTEGER,
  })
  reject_type_id: number;

  @Unique('std_reject_tb_factory_id_reject_cd_un')
  @Column({
    comment: '부적합코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  reject_cd: string;

  @Column({
    comment: '부적합명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  reject_nm: string;

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

  @Unique('std_reject_tb_uuid_un')
  @Column({
    comment: '부적합UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string

  //#region ✅ Define Association
  // HasMany
  @HasMany(() => StdProcReject, { foreignKey: 'reject_id' })
  stdProcReject: StdProcReject;

  // BelongsTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  updateUser: AutUser;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdRejectType, { foreignKey: 'reject_type_id', targetKey: 'reject_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdRejectType: StdRejectType;
  //#endregion
}