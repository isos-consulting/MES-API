import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IMatReceive from '../../interfaces/mat/receive.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdPartner from '../std/partner.model';
import StdSupplier from '../std/supplier.model';
import MatOrder from './order.model';

@Table({
  tableName: 'MAT_RECEIVE_TB',
  modelName: 'MatReceive',
  comment: '자재입하 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class MatReceive extends Model<IMatReceive> {
  @Column({
    comment: '자재입하ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  receive_id: number;

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

  @ForeignKey(() => StdSupplier)
  @Column({
    comment: '공급처ID',
    type: DataType.INTEGER,
  })
  supplier_id: number;

  @Column({
    comment: '전표번호',
    type: DataType.STRING(50),
  })
  stmt_no: string;

  @Column({
    comment: '입하 일시',
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

  @ForeignKey(() => MatOrder)
  @Column({
    comment: '자재발주ID',
    type: DataType.INTEGER,
  })
  order_id: number;

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

  @Unique('mat_receive_tb_uuid_un')
  @Column({
    comment: '자재입하UUID',
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

  @BelongsTo(() => StdSupplier, { foreignKey: 'supplier_id', targetKey: 'supplier_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdSupplier: StdSupplier;

  @BelongsTo(() => MatOrder, { foreignKey: 'order_id', targetKey: 'order_id', onDelete: 'restrict', onUpdate: 'cascade' })
  matOrder: MatOrder;

  // HasMany
  //#endregion
}