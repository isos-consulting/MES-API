import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import ISalOutgoOrderDetail from '../../interfaces/sal/outgo-order-detail.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdProd from '../std/prod.model';
import SalOrderDetail from './order-detail.model';
import SalOutgoOrder from './outgo-order.model';

@Table({
  tableName: 'SAL_OUTGO_ORDER_DETAIL_TB',
  modelName: 'SalOutgoOrderDetail',
  comment: '출하지시 상세정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class SalOutgoOrderDetail extends Model<ISalOutgoOrderDetail> {
  @Column({
    comment: '출하지시 상세ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  outgo_order_detail_id: number;

  @Unique('sal_outgo_order_detail_tb_outgo_order_id_seq_un')
  @ForeignKey(() => SalOutgoOrder)
  @Column({
    comment: '출하지시ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  outgo_order_id: number;

  @Unique('sal_outgo_order_detail_tb_outgo_order_id_seq_un')
  @Column({
    comment: '지시 순번',
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

  @ForeignKey(() => SalOrderDetail)
  @Column({
    comment: '제품수주 상세ID',
    type: DataType.INTEGER,
  })
  order_detail_id: number;

  @Column({
    comment: '지시완료 유무',
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

  @Unique('sal_outgo_order_detail_tb_uuid_un')
  @Column({
    comment: '출하지시 상세UUID',
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

  @BelongsTo(() => SalOutgoOrder, { foreignKey: 'outgo_order_id', targetKey: 'outgo_order_id', onDelete: 'restrict', onUpdate: 'cascade' })
  salOutgoOrder: SalOutgoOrder;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => SalOrderDetail, { foreignKey: 'order_detail_id', targetKey: 'order_detail_id', onDelete: 'restrict', onUpdate: 'cascade' })
  salOrderDetail: SalOrderDetail;

  // HasMany
  //#endregion
}