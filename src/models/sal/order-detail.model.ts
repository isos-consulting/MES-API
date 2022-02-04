import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import ISalOrderDetail from '../../interfaces/sal/order-detail.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdMoneyUnit from '../std/money-unit.model';
import StdProd from '../std/prod.model';
import SalOrder from './order.model';

@Table({
  tableName: 'SAL_ORDER_DETAIL_TB',
  modelName: 'SalOrderDetail',
  comment: '제품수주 상세정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class SalOrderDetail extends Model<ISalOrderDetail> {
  @Column({
    comment: '제품수주상세ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_detail_id: number;

  @Unique('sal_order_detail_tb_order_id_seq_un')
  @ForeignKey(() => SalOrder)
  @Column({
    comment: '제품수주ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

  @Unique('sal_order_detail_tb_order_id_seq_un')
  @Column({
    comment: '수주 순번',
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
    type: DataType.DECIMAL(19, 6)
  })
  total_price: number;

  @Column({
    comment: '단위 수량',
    type: DataType.DECIMAL(19, 6),
  })
  unit_qty: number;

  @Column({
    comment: '납기 일시',
    type: 'timestamp',
  })
  due_date: string;

  @Column({
    comment: '수주완료 유무',
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

  @Unique('sal_order_detail_tb_uuid_un')
  @Column({
    comment: '제품수주상세UUID',
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

  @BelongsTo(() => SalOrder, { foreignKey: 'order_id', targetKey: 'order_id', onDelete: 'restrict', onUpdate: 'cascade' })
  salOrder: SalOrder;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => StdMoneyUnit, { foreignKey: 'money_unit_id', targetKey: 'money_unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdMoneyUnit: StdMoneyUnit;

  // HasMany

  //#endregion
}