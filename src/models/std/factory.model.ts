import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, HasMany, BelongsTo, Unique } from 'sequelize-typescript'
import IStdFactory from '../../interfaces/std/factory.interface';
import AutUser from '../aut/user.model';
import StdProcReject from './proc-reject.model';
import StdProc from './proc.model';
import StdRejectType from './reject-type.model';
import StdReject from './reject.model';

@Table({
  tableName: 'STD_FACTORY_TB',
  modelName: 'StdFactory',
  comment: '공장 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdFactory extends Model<IStdFactory> {
  @Column({
    comment: '공장ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('std_factory_tb_factory_cd_un')
  @Column({
    comment: '공장코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  factory_cd: string;

  @Column({
    comment: '공장명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  factory_nm: string;

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

  @Unique('std_factory_tb_uuid_un')
  @Column({
    comment: '공장UUID',
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

  // HasMany
  @HasMany(() => StdProcReject, { foreignKey: 'factory_id' })
  stdProcReject: StdProcReject[];

  @HasMany(() => StdProc, { foreignKey: 'factory_id' })
  stdProc: StdProc[];

  @HasMany(() => StdRejectType, { foreignKey: 'factory_id' })
  stdRejectType: StdRejectType[];

  @HasMany(() => StdReject, { foreignKey: 'factory_id' })
  stdReject: StdReject[];
  //#endregion
}