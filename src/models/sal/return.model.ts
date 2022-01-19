import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import ISalReturn from '../../interfaces/sal/return.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdPartner from '../std/partner.model';
import StdDelivery from '../std/delivery.model';
import SalOutgo from './outgo.model';

@Table({
  tableName: 'SAL_RETURN_TB',
  modelName: 'SalReturn',
  comment: '제품반입 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class SalReturn extends Model<ISalReturn> {
  @Column({
    comment: '제품반입ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  return_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => StdPartner)
  @Column({
    comment: '거래처ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  partner_id: number;

  @ForeignKey(() => StdDelivery)
  @Column({
    comment: '납품처ID',
    type: DataType.INTEGER,
  })
  delivery_id: number;

  @Column({
    comment: '전표번호',
    type: DataType.STRING(50),
  })
  stmt_no: string;

  @Column({
    comment: '반입 일시',
    type: 'timestamp',
    allowNull: false,
  })
  reg_date: string;

  @Column({
    comment: '합계 금액',
    type: DataType.DECIMAL(19, 6),
  })
  total_price: number;

  @Column({
    comment: '합계 수량',
    type: DataType.DECIMAL(19, 6),
  })
  total_qty: number;

  @ForeignKey(() => SalOutgo)
  @Column({
    comment: '제품출하ID',
    type: DataType.INTEGER,
  })
  outgo_id: number;

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

  @Unique('sal_return_tb_uuid_un')
  @Column({
    comment: '제품반입UUID',
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

  @BelongsTo(() => StdPartner, { foreignKey: 'partner_id', targetKey: 'partner_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdPartner: StdPartner;

  @BelongsTo(() => StdDelivery, { foreignKey: 'delivery_id', targetKey: 'delivery_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdDelivery: StdDelivery;

  @BelongsTo(() => SalOutgo, { foreignKey: 'outgo_id', targetKey: 'outgo_id', onDelete: 'restrict', onUpdate: 'cascade' })
  salOutgo: SalOutgo;

  // HasMany
  //#endregion
}