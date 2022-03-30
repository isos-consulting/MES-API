import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IQmsRework from '../../interfaces/qms/rework.interface';
import AdmReworkType from '../adm/rework-type.model';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdLocation from '../std/location.model';
import StdProd from '../std/prod.model';
import StdReject from '../std/reject.model';
import StdStore from '../std/store.model';

@Table({
  tableName: 'QMS_REWORK_TB',
  modelName: 'QmsRework',
  comment: '재작업 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class QmsRework extends Model<IQmsRework> {
  @Column({
    comment: '재작업ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  rework_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;
  
  @Column({
    comment: '재작업 등록 일시',
    type: 'timestamp',
    allowNull: false,
  })
  reg_date: string;

  @Column({
    comment: '재작업 유형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  rework_type_id: number;

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

  @ForeignKey(() => StdReject)
  @Column({
    comment: '부적합ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  reject_id: number;

  @Column({
    comment: '재작업 수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  qty: number;

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

  @Unique('qms_rework_tb_uuid_un')
  @Column({
    comment: '재작업UUID',
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

  @BelongsTo(() => StdReject, { foreignKey: 'reject_id', targetKey: 'reject_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdReject: StdReject;

  @BelongsTo(() => AdmReworkType, { foreignKey: 'rework_type_id', targetKey: 'rework_type_id', constraints: false })
  admReworkType: AdmReworkType;

  @BelongsTo(() => StdStore, { as: 'fromStore', foreignKey: 'from_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  fromStdStore: StdStore;
  @BelongsTo(() => StdLocation, { as: 'fromLocation', foreignKey: 'from_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  fromStdLocation: StdLocation;

  @BelongsTo(() => StdStore, { as: 'toStore', foreignKey: 'to_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  toStdStore: StdStore
  @BelongsTo(() => StdLocation, { as: 'toLocation', foreignKey: 'to_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  toStdLocation: StdLocation;

  // HasMany
  //#endregion
}