import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Sequelize, Table, Unique, UpdatedAt } from "sequelize-typescript";
import IStdBarcodeHistory from "../../interfaces/std/barcode-history.interface";
import AdmTranType from "../adm/tran-type.model";
import AutUser from "../aut/user.model";
import StdFactory from "./factory.model";
import StdProd from "./prod.model";

@Table({
  tableName: 'STD_BARCODE_HISTORY_TB',
  modelName: 'StdBarcodeHistory',
  comment: '바코드 이력 테이블',
  timestamps: true,
  underscored: true,
})

export default class StdBarcodeHistory extends Model<IStdBarcodeHistory> {
  @Column({
    comment: '바코드이력ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  barcode_history_id: number;

  @Column({
    comment: '바코드',
    type: DataType.STRING(100),
    allowNull: false,
  })
  barcode: string;

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
    comment: 'LOT',
    type: DataType.STRING(25),
    allowNull: false,
  })
  lot_no: string;

  @Column({
    comment: '수량',
    type: DataType.INTEGER,
    allowNull: false,
  })
  qty: number;

  @Column({
    comment: '바코드 사용 일시',
    type: DataType.DATE,
    allowNull: false,
  })
  reg_date: Date;

  @ForeignKey(() => AdmTranType)
  @Column({
    comment: '수불 유형 ID',
    type: DataType.NUMBER,
    allowNull: true,
  })
  tran_type_id: string;

  @Column({
    comment: '바코드 사용 관련 ID',
    type: DataType.NUMBER,
    allowNull: true,
  })
  reference_id: number;

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

  @Unique('std_barcode_history_tb_uuid_un')
  @Column({
    comment: '바코드이력UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string;

  // #region ✅ Define Association
  // BelongTO
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  updateUser: AutUser;
  
  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => AdmTranType, { foreignKey: 'tran_type_id', targetKey: 'tran_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  admTranType: AdmTranType;
  // HasMany
  // #endregion
}