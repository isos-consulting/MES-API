import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IPrdWorkWorker from '../../interfaces/prd/work-worker.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdEmp from '../std/emp.model';
import PrdWork from './work.model';
import PrdWorkRouting from './work-routing.model'

@Table({
  tableName: 'PRD_WORK_WORKER_TB',
  modelName: 'PrdWorkWorker',
  comment: '작업자 투입 정보(실적) 테이블',
  timestamps: true,
  underscored: true,
})
export default class PrdWorkWorker extends Model<IPrdWorkWorker> {
  @Column({
    comment: '실적 작업자 투입ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_emp_id: number;

  @Unique('prd_work_worker_tb_factory_id_work_id_work_routing_id_emp_id_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('prd_work_worker_tb_factory_id_work_id_work_routing_id_emp_id_un')
  @ForeignKey(() => PrdWork)
  @Column({
    comment: '실적ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_id: number;

  @Unique('prd_work_worker_tb_factory_id_work_id_work_routing_id_emp_id_un')
  @ForeignKey(() => PrdWorkRouting)
  @Column({
    comment: '실적ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_routing_id: number;

  @Unique('prd_work_worker_tb_factory_id_work_id_work_routing_id_emp_id_un')
  @ForeignKey(() => StdEmp)
  @Column({
    comment: '작업자ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  emp_id: number;

  @Column({
    comment: '작업 시작 일시',
    type: 'timestamp',
  })
  start_date: string;

  @Column({
    comment: '작업 종료 일시',
    type: 'timestamp',
  })
  end_date: string;

  @Column({
    comment: '작업 시간',
    type: DataType.DECIMAL(19, 6),
  })
  work_time: number;

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

  @Unique('prd_work_worker_tb_uuid_un')
  @Column({
    comment: '실적 작업자 투입UUID',
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

  @BelongsTo(() => PrdWork, { foreignKey: 'work_id', targetKey: 'work_id', onDelete: 'restrict', onUpdate: 'cascade' })
  prdWork: PrdWork;
  @BelongsTo(() => PrdWorkRouting, { foreignKey: 'work_routing_id', targetKey: 'work_routing_id', onDelete: 'restrict', onUpdate: 'cascade' })
  prdWorkRouting: PrdWorkRouting;

  @BelongsTo(() => StdEmp, { foreignKey: 'emp_id', targetKey: 'emp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEmp: StdEmp;

  // HasMany
  //#endregion
}