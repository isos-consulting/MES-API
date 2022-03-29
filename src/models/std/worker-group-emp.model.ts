import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdWorkerGroupWorker from '../../interfaces/std/worker-group-emp.interface';
import AutUser from '../aut/user.model';
import StdFactory from './factory.model';
import StdWorkerGroup from './worker-group.model';
import StdEmp from './emp.model';

@Table({
  tableName: 'STD_WORKER_GROUP_EMP_TB',
  modelName: 'StdWorkerGroupEmp',
  comment: '작업조-작업자 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdWorkerGroupWorker extends Model<IStdWorkerGroupWorker> {
  @Column({
    comment: '작업조-작업자ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  worker_group_emp_id: number;

  @Unique('std_worker_group_emp_tb_worker_group_id_emp_id_un')
  @ForeignKey(() => StdWorkerGroup)
  @Column({
    comment: '작업조ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  worker_group_id: number;

  @Unique('std_worker_group_emp_tb_worker_group_id_emp_id_un')
  @ForeignKey(() => StdEmp)
  @Column({
    comment: '작업자ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  emp_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

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

  @Unique('std_worker_group_emp_tb_uuid_un')
  @Column({
    comment: '작업조-작업자UUID',
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

  @BelongsTo(() => StdWorkerGroup, { foreignKey: 'worker_group_id', targetKey: 'worker_group_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdWorkerGroup: StdWorkerGroup;

  @BelongsTo(() => StdEmp, { foreignKey: 'emp_id', targetKey: 'emp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEmp: StdEmp;

  // HasMany
  //#endregion
}