import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IPrdOrderWorker from '../../interfaces/prd/order-worker.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdEmp from '../std/emp.model';
import PrdOrder from './order.model';

@Table({
  tableName: 'PRD_ORDER_WORKER_TB',
  modelName: 'PrdOrderWorker',
  comment: '작업자 투입 정보(지시) 테이블',
  timestamps: true,
  underscored: true,
})
export default class PrdOrderWorker extends Model<IPrdOrderWorker> {
  @Column({
    comment: '지시 작업자 투입ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_emp_id: number;

  @Unique('prd_order_worker_tb_factory_id_order_id_emp_id_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('prd_order_worker_tb_factory_id_order_id_emp_id_un')
  @ForeignKey(() => PrdOrder)
  @Column({
    comment: '지시ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

  @Unique('prd_order_worker_tb_factory_id_order_id_emp_id_un')
  @ForeignKey(() => StdEmp)
  @Column({
    comment: '작업자ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  emp_id: number;

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

  @Unique('prd_order_worker_tb_uuid_un')
  @Column({
    comment: '지시 작업자 투입UUID',
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

  @BelongsTo(() => PrdOrder, { foreignKey: 'order_id', targetKey: 'order_id', onDelete: 'restrict', onUpdate: 'cascade' })
  prdOrder: PrdOrder;

  @BelongsTo(() => StdEmp, { foreignKey: 'emp_id', targetKey: 'emp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEmp: StdEmp;

  // HasMany
  //#endregion
}