import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey, HasMany, Unique, Sequelize } from 'sequelize-typescript'
import IStdProc from '../../interfaces/std/proc.interface';
import AutUser from '../aut/user.model';
import StdFactory from './factory.model';
import StdProcReject from './proc-reject.model';

@Table({
  tableName: 'STD_PROC_TB',
  modelName: 'StdProc',
  comment: '공정 정보 테이블',
  timestamps: true,
  underscored: true
})
export default class StdProc extends Model<IStdProc> {
  @Column({
    comment: '공정ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  proc_id: number;

  @Unique('std_proc_tb_factory_id_proc_cd_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false
  })
  factory_id: number;

  @Unique('std_proc_tb_factory_id_proc_cd_un')
  @Column({
    comment: '공정코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  proc_cd: string;

  @Column({
    comment: '공정명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  proc_nm: string;

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

  @Unique('std_proc_tb_uuid_un')
  @Column({
    comment: '공정UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string

  //#region ✅ Define Association
  // HasMany
  @HasMany(() => StdProcReject, { foreignKey: 'proc_id', onDelete: 'no action', onUpdate: 'cascade' })
  stdProcReject: StdProcReject;

  // BelongsTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  updateUser: AutUser;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', onDelete: 'no action', onUpdate: 'cascade' })
  stdFactory: StdFactory;
  //#endregion
}