import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IPrdOrder from '../../interfaces/prd/order.interface';
import AutUser from '../aut/user.model';
import MldMold from '../mld/mold.model';
import SalOrderDetail from '../sal/order-detail.model';
import StdEquip from '../std/equip.model';
import StdFactory from '../std/factory.model';
import StdProc from '../std/proc.model';
import StdProd from '../std/prod.model';
import StdShift from '../std/shift.model';
import StdWorkerGroup from '../std/worker-group.model';
import StdWorkings from '../std/workings.model';

@Table({
  tableName: 'PRD_ORDER_TB',
  modelName: 'PrdOrder',
  comment: '생산지시 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class PrdOrder extends Model<IPrdOrder> {
  @Column({
    comment: '지시ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

  @Unique('prd_order_tb_factory_id_order_no_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Column({
    comment: '지시 일시',
    type: DataType.DATE,
    allowNull: false,
  })
  reg_date: Date;

  @Unique('prd_order_tb_factory_id_order_no_un')
  @Column({
    comment: '지시번호',
    type: DataType.STRING(50),
    allowNull: false,
  })
  order_no: number;

  @ForeignKey(() => StdProc)
  @Column({
    comment: '공정ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  proc_id: number;

  @ForeignKey(() => StdWorkings)
  @Column({
    comment: '작업장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  workings_id: number;

  @ForeignKey(() => StdEquip)
  @Column({
    comment: '설비ID',
    type: DataType.INTEGER,
  })
  equip_id: number;

  @ForeignKey(() => MldMold)
  @Column({
    comment: '금형ID',
    type: DataType.INTEGER,
  })
  mold_id: number;

  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @Column({
    comment: '계획 수량',
    type: DataType.DECIMAL(19, 6),
  })
  plan_qty: number;

  @Column({
    comment: '지시 수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  qty: number;

  @Column({
    comment: '지시 순번',
    type: DataType.INTEGER,
  })
  seq: number;

  @ForeignKey(() => StdShift)
  @Column({
    comment: '작업교대ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  shift_id: number;

  @ForeignKey(() => StdWorkerGroup)
  @Column({
    comment: '작업조ID',
    type: DataType.INTEGER,
  })
  worker_group_id: number;

  @Column({
    comment: '생산 진행 여부 (0: 미진행, 1: 진행 중)',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  work_fg: boolean;

  @Column({
    comment: '시작 예정 일시',
    type: DataType.DATE,
  })
  start_date: Date;

  @Column({
    comment: '종료 예정 일시',
    type: DataType.DATE,
  })
  end_date: Date;

  @Column({
    comment: '마감 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  complete_fg: boolean;

  @Column({
    comment: '마감 일시',
    type: DataType.DATE,
  })
  complete_date: Date;

  @ForeignKey(() => SalOrderDetail)
  @Column({
    comment: '수주 상세ID',
    type: DataType.INTEGER,
  })
  sal_order_detail_id: number;

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

  @Unique('prd_order_tb_uuid_un')
  @Column({
    comment: '지시UUID',
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

  @BelongsTo(() => StdProc, { foreignKey: 'proc_id', targetKey: 'proc_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProc: StdProc;

  @BelongsTo(() => StdWorkings, { foreignKey: 'workings_id', targetKey: 'workings_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdWorkings: StdWorkings;

  @BelongsTo(() => StdEquip, { foreignKey: 'equip_id', targetKey: 'equip_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEquip: StdEquip;

  @BelongsTo(() => MldMold, { foreignKey: 'mold_id', targetKey: 'mold_id', onDelete: 'restrict', onUpdate: 'cascade' })
  mldMold: MldMold;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => StdShift, { foreignKey: 'shift_id', targetKey: 'shift_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdShift: StdShift;

  @BelongsTo(() => StdWorkerGroup, { foreignKey: 'worker_group_id', targetKey: 'worker_group_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdWorkerGroup: StdWorkerGroup;

  @BelongsTo(() => SalOrderDetail, { foreignKey: 'sal_order_detail_id', targetKey: 'order_detail_id', onDelete: 'restrict', onUpdate: 'cascade' })
  salOrderDetail: SalOrderDetail;

  // HasMany
  //#endregion
}