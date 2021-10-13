import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IOutReleaseDetail from '../../interfaces/out/release-detail.interface';
import AutUser from '../aut/user.model';
import MatOrderDetail from '../mat/order-detail.model';
import StdFactory from '../std/factory.model';
import StdLocation from '../std/location.model';
import StdMoneyUnit from '../std/money-unit.model';
import StdProd from '../std/prod.model';
import StdStore from '../std/store.model';
import OutRelease from './release.model';

@Table({
  tableName: 'OUT_RELEASE_DETAIL_TB',
  modelName: 'OutReleaseDetail',
  comment: '외주출고 상세정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class OutReleaseDetail extends Model<IOutReleaseDetail> {
  @Column({
    comment: '외주출고 상세ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  release_detail_id: number;

  @Unique('out_release_detail_tb_release_id_seq_un')
  @ForeignKey(() => OutRelease)
  @Column({
    comment: '외주출고ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  release_id: number;

  @Unique('out_release_detail_tb_release_id_seq_un')
  @Column({
    comment: '출고 순번',
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
    comment: 'LOT NO',
    type: DataType.STRING(25),
    allowNull: false,
  })
  lot_no: string;
  
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

  @ForeignKey(() => MatOrderDetail)
  @Column({
    comment: '발주 상세ID',
    type: DataType.INTEGER,
  })
  order_detail_id: number;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '출고 창고ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  from_store_id: number;

  @ForeignKey(() => StdLocation)
  @Column({
    comment: '출고 위치ID',
    type: DataType.INTEGER,
  })
  from_location_id: number;

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

  @Unique('out_release_detail_tb_uuid_un')
  @Column({
    comment: '외주출고 상세UUID',
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

  @BelongsTo(() => OutRelease, { foreignKey: 'release_id', targetKey: 'release_id', onDelete: 'restrict', onUpdate: 'cascade' })
  outRelease: OutRelease;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => StdMoneyUnit, { foreignKey: 'money_unit_id', targetKey: 'money_unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdMoneyUnit: StdMoneyUnit;
  
  @BelongsTo(() => MatOrderDetail, { foreignKey: 'order_detail_id', targetKey: 'order_detail_id', onDelete: 'restrict', onUpdate: 'cascade' })
  matOrderDetail: MatOrderDetail;
  
  @BelongsTo(() => StdStore, { foreignKey: 'from_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdStore: StdStore;

  @BelongsTo(() => StdLocation, { foreignKey: 'from_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdLocation: StdLocation;

  // HasMany
  //#endregion
}