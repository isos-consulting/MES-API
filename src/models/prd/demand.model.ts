import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IPrdDemand from '../../interfaces/prd/demand.interface';
import AdmDemandType from '../adm/demand-type.model';
import AutUser from '../aut/user.model';
import StdDept from '../std/dept.model';
import StdEquip from '../std/equip.model';
import StdFactory from '../std/factory.model';
import StdLocation from '../std/location.model';
import StdProc from '../std/proc.model';
import StdProd from '../std/prod.model';
import StdStore from '../std/store.model';
import PrdOrder from './order.model';

@Table({
  tableName: 'PRD_DEMAND_TB',
  modelName: 'PrdDemand',
  comment: '자재출고요청 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class PrdDemand extends Model<IPrdDemand> {
  @Column({
    comment: '자재출고요청ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  demand_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => PrdOrder)
  @Column({
    comment: '작업지시ID',
    type: DataType.INTEGER,
  })
  order_id: number;

  @Column({
    comment: '자재출고요청 일시',
    type: 'timestamp',
    allowNull: false,
  })
  reg_date: string;

  @Column({
    comment: '자재출고요청 유형코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  demand_type_cd: Date;

  @ForeignKey(() => StdProc)
  @Column({
    comment: '공정ID',
    type: DataType.INTEGER,
  })
  proc_id: number;

  @ForeignKey(() => StdEquip)
  @Column({
    comment: '설비ID',
    type: DataType.INTEGER,
  })
  equip_id: number;

  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @Column({
    comment: '수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  qty: number;

  @Column({
    comment: '투입완료 유무',
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  complete_fg: boolean;

  @ForeignKey(() => StdDept)
  @Column({
    comment: '자재출고요청 부서ID',
    type: DataType.INTEGER,
  })
  dept_id: number;

  @Column({
    comment: '납기 일시',
    type: 'timestamp'
  })
  due_date: string;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '입고 창고ID',
    type: DataType.INTEGER,
    allowNull: false,
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

  @Unique('prd_demand_tb_uuid_un')
  @Column({
    comment: '자재출고요청UUID',
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

  @BelongsTo(() => StdEquip, { foreignKey: 'equip_id', targetKey: 'equip_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEquip: StdEquip;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => StdDept, { foreignKey: 'dept_id', targetKey: 'dept_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdDept: StdDept;

  @BelongsTo(() => AdmDemandType, { foreignKey: 'demand_type_cd', targetKey: 'demand_type_cd', constraints: false })
  admDemandType: AdmDemandType;

  @BelongsTo(() => StdStore, { foreignKey: 'to_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdStore: StdStore

  @BelongsTo(() => StdLocation, { foreignKey: 'to_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdLocation: StdLocation;

  // HasMany
  //#endregion
}