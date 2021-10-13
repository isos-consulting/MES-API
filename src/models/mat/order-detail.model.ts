import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IMatOrderDetail from '../../interfaces/mat/order-detail.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdMoneyUnit from '../std/money-unit.model';
import StdProd from '../std/prod.model';
import StdUnit from '../std/unit.model';
import MatOrder from './order.model';

@Table({
  tableName: 'MAT_ORDER_DETAIL_TB',
  modelName: 'MatOrderDetail',
  comment: '자재발주 상세정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class MatOrderDetail extends Model<IMatOrderDetail> {
  @Column({
    comment: '자재발주 상세ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_detail_id: number;

  @Unique('mat_order_detail_tb_order_id_seq_un')
  @ForeignKey(() => MatOrder)
  @Column({
    comment: '자재발주ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

  @Unique('mat_order_detail_tb_order_id_seq_un')
  @Column({
    comment: '발주 순번',
    type: DataType.INTEGER,
    allowNull: false,
  })
  seq: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @ForeignKey(() => StdUnit)
  @Column({
    comment: '단위ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  unit_id: number;
  
  @Column({
    comment: '수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  qty: number;

  @Column({
    comment: '금액',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  price: number;

  @ForeignKey(() => StdMoneyUnit)
  @Column({
    comment: '화폐 단위ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  money_unit_id: number;

  @Column({
    comment: '환율',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  exchange: number;

  @Column({
    comment: '합계 금액',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  total_price: number;

  @Column({
    comment: '단위 수량',
    type: DataType.DECIMAL(19, 6),
  })
  unit_qty: number;

  @Column({
    comment: '납기 일시',
    type: DataType.DATE,
  })
  due_date: Date;

  @Column({
    comment: '발주완료 유무',
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  complete_fg: boolean;

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

  @Unique('mat_order_detail_tb_uuid_un')
  @Column({
    comment: '자재발주 상세UUID',
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

  @BelongsTo(() => MatOrder, { foreignKey: 'order_id', targetKey: 'order_id', onDelete: 'restrict', onUpdate: 'cascade' })
  matOrder: MatOrder;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => StdUnit, { foreignKey: 'unit_id', targetKey: 'unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdUnit: StdUnit;

  @BelongsTo(() => StdMoneyUnit, { foreignKey: 'money_unit_id', targetKey: 'money_unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdMoneyUnit: StdMoneyUnit;

  // HasMany

  //#endregion
}