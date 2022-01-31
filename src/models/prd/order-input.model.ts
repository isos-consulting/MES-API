import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IPrdOrderInput from '../../interfaces/prd/order-input.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdLocation from '../std/location.model';
import StdProd from '../std/prod.model';
import StdStore from '../std/store.model';
import StdUnitConvert from '../std/unit-convert.model';
import StdUnit from '../std/unit.model';
import PrdOrder from './order.model';
// import AdmBomInputType from '../adm/bom-input-type.model';

@Table({
  tableName: 'PRD_ORDER_INPUT_TB',
  modelName: 'PrdOrderInput',
  comment: '투입이력 정보(지시) 테이블',
  timestamps: true,
  underscored: true,
})
export default class PrdOrderInput extends Model<IPrdOrderInput> {
  @Column({
    comment: '지시 투입이력ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_input_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => PrdOrder)
  @Column({
    comment: '지시ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @Column({
    comment: '소요량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  c_usage: number;

  @ForeignKey(() => StdUnit)
  @Column({
    comment: '단위ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  unit_id: number;
  
  // @ForeignKey(() => AdmBomInputType)
  // @Column({
  //   comment: '투입방법ID',
  //   type: DataType.INTEGER,
  //   allowNull: false,
  // })
  // bom_input_type_id: number;

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

  @Unique('prd_order_input_tb_uuid_un')
  @Column({
    comment: '지시 투입이력UUID',
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

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => StdUnit, { foreignKey: 'unit_id', targetKey: 'unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdUnit: StdUnit;

  @BelongsTo(() => StdUnitConvert, { foreignKey: 'unit_id', targetKey: 'from_unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdUnitConvert: StdUnitConvert;

  // @BelongsTo(() => AdmBomInputType, { foreignKey: 'bom_input_type_id', targetKey: 'bom_input_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  // admBomInputType: AdmBomInputType;

  @BelongsTo(() => StdStore, { foreignKey: 'from_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdStore: StdStore;
  
  @BelongsTo(() => StdLocation, { foreignKey: 'from_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdLocation: StdLocation;

  // HasMany
  //#endregion
}