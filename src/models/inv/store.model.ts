import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IInvStore from '../../interfaces/inv/store.interface';
import AdmTranType from '../adm/tran-type.model';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdLocation from '../std/location.model';
import StdPartner from '../std/partner.model';
import StdProd from '../std/prod.model';
import StdReject from '../std/reject.model';
import StdStore from '../std/store.model';

@Table({
  tableName: 'INV_STORE_TB',
  modelName: 'InvStore',
  comment: '창고 수불 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class InvStore extends Model<IInvStore> {
  @Column({
    comment: '전표ID',
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  tran_id: number;

  @Column({
    comment: '입출고 구분 ([true] IN, [false] OUT)',
    primaryKey: true,
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  inout_fg: boolean;

  @ForeignKey(() => AdmTranType)
  @Column({
    comment: '수불 유형ID',
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  tran_type_id: string;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Column({
    comment: '수불 일시',
    type: 'timestamp',
    allowNull: false,
  })
  reg_date: string;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '창고ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  store_id: number;

  @ForeignKey(() => StdLocation)
  @Column({
    comment: '위치ID',
    type: DataType.INTEGER,
  })
  location_id: number;

  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @ForeignKey(() => StdReject)
  @Column({
    comment: '부적합ID',
    type: DataType.INTEGER,
  })
  reject_id: number;

	@ForeignKey(() => StdPartner)
  @Column({
    comment: '거래처ID',
    type: DataType.INTEGER,
  })
  partner_id: number;

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

  @Unique('inv_store_tb_uuid_un')
  @Column({
    comment: '창고 수불UUID',
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

  @BelongsTo(() => AdmTranType, { foreignKey: 'tran_type_id', targetKey: 'tran_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  admTranType: AdmTranType;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdStore, { foreignKey: 'store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdStore: StdStore;

  @BelongsTo(() => StdLocation, { foreignKey: 'location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdLocation: StdLocation;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => StdReject, { foreignKey: 'reject_id', targetKey: 'reject_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdReject: StdReject;

	@BelongsTo(() => StdPartner, { foreignKey: 'partner_id', targetKey: 'partner_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdPartner: StdPartner;

  // HasMany
  //#endregion
}