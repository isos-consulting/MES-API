import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IPrdWork from '../../interfaces/prd/work.interface';
import AutUser from '../aut/user.model';
import MldMold from '../mld/mold.model';
import StdEquip from '../std/equip.model';
import StdFactory from '../std/factory.model';
import StdLocation from '../std/location.model';
import StdProc from '../std/proc.model';
import StdProd from '../std/prod.model';
import StdShift from '../std/shift.model';
import StdStore from '../std/store.model';
import StdWorkings from '../std/workings.model';
import PrdOrder from './order.model';

@Table({
  tableName: 'PRD_WORK_TB',
  modelName: 'PrdWork',
  comment: '생산실적 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class PrdWork extends Model<IPrdWork> {
  @Column({
    comment: '실적ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Column({
    comment: '실적 일시',
    type: 'timestamp',
    allowNull: false,
  })
  reg_date: string;

  @ForeignKey(() => PrdOrder)
  @Column({
    comment: '지시ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

  @Column({
    comment: '실적 순번',
    type: DataType.INTEGER,
  })
  seq: number;

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

  @Column({
    comment: '금형 Cavity',
    type: DataType.INTEGER,
  })
  mold_cavity: number;

  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @Column({
    comment: 'LOT NO',
    type: DataType.STRING(25),
    allowNull: false,
  })
  lot_no: string;

  @Column({
    comment: '양품 수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  qty: number;

  @Column({
    comment: '부적합 수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  reject_qty: number;

  @Column({
    comment: '생산 시작 일시',
    type: 'timestamp',
    allowNull: false,
  })
  start_date: string;

  @Column({
    comment: '생산 종료 일시',
    type: 'timestamp',
  })
  end_date: string;

  @Column({
    comment: '작업시간',
    type: DataType.INTEGER,
  })
  work_time: number;

  @ForeignKey(() => StdShift)
  @Column({
    comment: '작업교대ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  shift_id: number;

  @Column({
    comment: '생산 종료 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  complete_fg: boolean;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '입고 창고ID',
    type: DataType.INTEGER,
  })
  to_store_id: number;

  @ForeignKey(() => StdLocation)
  @Column({
    comment: '입고 위치ID',
    type: DataType.INTEGER,
  })
  to_location_id: number;

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

  @Unique('prd_work_tb_uuid_un')
  @Column({
    comment: '실적UUID',
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

  @BelongsTo(() => StdStore, { foreignKey: 'to_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdStore: StdStore
  
  @BelongsTo(() => StdLocation, { foreignKey: 'to_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdLocation: StdLocation;

  // HasMany
  //#endregion
}