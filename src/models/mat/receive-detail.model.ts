import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IMatReceiveDetail from '../../interfaces/mat/receive-detail.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdLocation from '../std/location.model';
import StdMoneyUnit from '../std/money-unit.model';
import StdProd from '../std/prod.model';
import StdStore from '../std/store.model';
import StdUnit from '../std/unit.model';
import MatOrderDetail from './order-detail.model';
import MatReceive from './receive.model';

@Table({
  tableName: 'MAT_RECEIVE_DETAIL_TB',
  modelName: 'MatReceiveDetail',
  comment: '자재입하 상세정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class MatReceiveDetail extends Model<IMatReceiveDetail> {
  @Column({
    comment: '자재입하 상세ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  receive_detail_id: number;

  @Unique('mat_receive_detail_tb_receive_id_seq_un')
  @ForeignKey(() => MatReceive)
  @Column({
    comment: '자재입하ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  receive_id: number;

  @Unique('mat_receive_detail_tb_receive_id_seq_un')
  @Column({
    comment: '입하 순번',
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
    comment: 'LOT NO',
    type: DataType.STRING(25),
    allowNull: false,
  })
  lot_no: string;

  @Column({
    comment: '제조 LOT NO',
    type: DataType.STRING(25),
  })
  manufactured_lot_no: string;
  
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
    comment: '검사항목 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  insp_fg: number;

  @Column({
    comment: '이월 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  carry_fg: number;

  @ForeignKey(() => MatOrderDetail)
  @Column({
    comment: '자재발주 상세ID',
    type: DataType.INTEGER,
  })
  order_detail_id: number;

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

  @Column({
    comment: '바코드',
    type: DataType.STRING(100),
  })
  barcode: string;

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

  @Unique('mat_receive_detail_tb_uuid_un')
  @Column({
    comment: '자재입하 상세UUID',
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

  @BelongsTo(() => MatReceive, { foreignKey: 'receive_id', targetKey: 'receive_id', onDelete: 'restrict', onUpdate: 'cascade' })
  matReceive: MatReceive;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => StdUnit, { foreignKey: 'unit_id', targetKey: 'unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdUnit: StdUnit;

  @BelongsTo(() => StdMoneyUnit, { foreignKey: 'money_unit_id', targetKey: 'money_unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdMoneyUnit: StdMoneyUnit;

  @BelongsTo(() => MatOrderDetail, { foreignKey: 'order_detail_id', targetKey: 'order_detail_id', onDelete: 'restrict', onUpdate: 'cascade' })
  matOrderDetail: MatOrderDetail;

  @BelongsTo(() => StdStore, { foreignKey: 'to_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdStore: StdStore;

  @BelongsTo(() => StdLocation, { foreignKey: 'to_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdLocation: StdLocation;

  // HasMany
  //#endregion
}