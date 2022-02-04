import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IMatRelease from '../../interfaces/mat/release.interface';
import AutUser from '../aut/user.model';
import PrdDemand from '../prd/demand.model';
import StdFactory from '../std/factory.model';
import StdLocation from '../std/location.model';
import StdProd from '../std/prod.model';
import StdStore from '../std/store.model';

@Table({
  tableName: 'MAT_RELEASE_TB',
  modelName: 'MatRelease',
  comment: '자재출고 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class MatRelease extends Model<IMatRelease> {
  @Column({
    comment: '자재출고ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  release_id: number;

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
    comment: '투입 일시',
    type: 'timestamp',
    allowNull: false,
  })
  reg_date: string;

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

  @ForeignKey(() => PrdDemand)
  @Column({
    comment: '자재출고요청ID',
    type: DataType.INTEGER,
  })
  demand_id: number;

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

  @Unique('mat_release_tb_uuid_un')
  @Column({
    comment: '자재출고UUID',
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

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => PrdDemand, { foreignKey: 'demand_id', targetKey: 'demand_id', onDelete: 'restrict', onUpdate: 'cascade' })
  prdDemand: PrdDemand;

  @BelongsTo(() => StdStore, { as:'fromStore', foreignKey: 'from_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFromStore: StdStore;

  @BelongsTo(() => StdLocation, { as:'fromLocation', foreignKey: 'from_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFromLocation: StdLocation;

  @BelongsTo(() => StdStore, { as:'toStore', foreignKey: 'to_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdToStore: StdStore;

  @BelongsTo(() => StdLocation, { as:'toLocation', foreignKey: 'to_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdToLocation: StdLocation;


  // HasMany
  //#endregion
}