import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdVendorPrice from '../../interfaces/std/vendor-price.interface';
import AutUser from '../aut/user.model';
import StdMoneyUnit from './money-unit.model';
import StdPartner from './partner.model';
import StdPriceType from './price-type.model';
import StdProd from './prod.model';
import StdUnit from './unit.model';

@Table({
  tableName: 'STD_VENDOR_PRICE_TB',
  modelName: 'StdVendorPrice',
  comment: '협력사 단가 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdVendorPrice extends Model<IStdVendorPrice> {
  @Column({
    comment: '협력사 단가 ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  vendor_price_id: number;

  @Unique('std_vendor_price_tb_partner_id_prod_id_start_date_un')
  @ForeignKey(() => StdPartner)
  @Column({
    comment: '협력사 ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  partner_id: number;

  @Unique('std_vendor_price_tb_partner_id_prod_id_start_date_un')
  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목 ID',
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
    comment: '단가',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  price: number;

  @ForeignKey(() => StdMoneyUnit)
  @Column({
    comment: '화폐단위 ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  money_unit_id: number;

  @ForeignKey(() => StdPriceType)
  @Column({
    comment: '단가유형 ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  price_type_id: number;

  @Unique('std_vendor_price_tb_partner_id_prod_id_start_date_un')
  @Column({
    comment: '단가 적용일자',
    type: DataType.DATEONLY,
    allowNull: false,
  })
  start_date: string;

  @Column({
    comment: '단가 적용종료일자',
    type: DataType.DATEONLY,
    allowNull: false,
  })
  end_date: string;

  @Column({
    comment: '소급단가',
    type: DataType.DECIMAL(19, 6),
  })
  retroactive_price: number;

  @Column({
    comment: '배분율',
    type: DataType.INTEGER,
  })
  division: number;

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

  @Unique('std_vendor_price_tb_uuid_un')
  @Column({
    comment: '협력사 단가 UUID',
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

  @BelongsTo(() => StdPartner, { foreignKey: 'partner_id', targetKey: 'partner_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdPartner: StdPartner;
  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;
  @BelongsTo(() => StdUnit, { foreignKey: 'unit_id', targetKey: 'unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdUnit: StdUnit;
  @BelongsTo(() => StdMoneyUnit, { foreignKey: 'money_unit_id', targetKey: 'money_unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdMoneyUnit: StdMoneyUnit;
  @BelongsTo(() => StdPriceType, { foreignKey: 'price_type_id', targetKey: 'price_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdPriceType: StdPriceType;

  // HasMany
  //#endregion
}