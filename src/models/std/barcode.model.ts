import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Sequelize, Table, Unique, UpdatedAt } from "sequelize-typescript";
import IStdBarcode from "../../interfaces/std/barcode.interface";
import AutUser from "../aut/user.model";
import StdFactory from "./factory.model";
import StdProd from "./prod.model";

@Table({
  tableName: 'STD_BARCODE_TB',
  modelName: 'StdBarcode',
  comment: '바코드 정보 테이블',
  timestamps: true,
  underscored: true,
})

export default class StdBarcode extends Model<IStdBarcode> {
  @Column({
    comment: '바코드ID', 
    primaryKey: true, 
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  barcode_id: number;

  @Unique('std_barcode_tb_barcode_un')
  @Column({
    comment: '바코드',
    type: DataType.STRING(100),
    allowNull: false
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
    comment: '비고',
    type: DataType.STRING(250),
    allowNull: true,
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

  @Unique('std_barcode_tb_uuid_un')
  @Column({
    comment: '바코드UUID',
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
  // HasMany
  // #endregion
}