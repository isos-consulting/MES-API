import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, ForeignKey, Unique, Sequelize } from 'sequelize-typescript'
import IStdProcReject from '../../interfaces/std/proc-reject.interface';
import AutUser from '../aut/user.model';
import StdFactory from './factory.model';
import StdProc from './proc.model';
import StdReject from './reject.model';

@Table({
  tableName: 'STD_PROC_REJECT_TB',
  modelName: 'StdProcReject',
  comment: '공정별 부적합 정보 테이블',
  timestamps: true,
  underscored: true
})
export default class StdProcReject extends Model<IStdProcReject> {
  @Column({
    comment: '공정별부적합ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  proc_reject_id: number;

  @Unique('std_proc_reject_tb_factory_id_proc_id_reject_id_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;
  
  @Unique('std_proc_reject_tb_factory_id_proc_id_reject_id_un')
  @ForeignKey(() => StdProc)
  @Column({
    comment: '공정ID',
    type: DataType.INTEGER,
    allowNull: false
  })
  proc_id: number;

  @Unique('std_proc_reject_tb_factory_id_proc_id_reject_id_un')
  @ForeignKey(() => StdReject)
  @Column({
    comment: '부적합ID',
    type: DataType.INTEGER,
    allowNull: false
  })
  reject_id: number;

  @Column({
    comment: '비고',
    type: DataType.STRING(250),
  })
  remark: string;

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

  @Unique('std_proc_reject_tb_uuid_un')
  @Column({
    comment: '공정별 부적합UUID',
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

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdProc, { foreignKey: 'proc_id', targetKey: 'proc_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProc: StdProc;

  @BelongsTo(() => StdReject, { foreignKey: 'reject_id', targetKey: 'reject_id', onDelete: 'restrict', onUpdate: 'cascade'})
  stdReject: StdReject;
  //#endregion
}