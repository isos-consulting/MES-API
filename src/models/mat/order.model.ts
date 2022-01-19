import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IMatOrder from '../../interfaces/mat/order.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdPartner from '../std/partner.model';

@Table({
  tableName: 'MAT_ORDER_TB',
  modelName: 'MatOrder',
  comment: '자재발주 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class MatOrder extends Model<IMatOrder> {
  @Column({
    comment: '자재발주ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

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

  @Column({
    comment: '전표번호',
    type: DataType.STRING(50),
  })
  stmt_no: string;

  @Column({
    comment: '발주 일시',
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

  @Unique('mat_order_tb_uuid_un')
  @Column({
    comment: '자재발주UUID',
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

  // HasMany
  //#endregion
}