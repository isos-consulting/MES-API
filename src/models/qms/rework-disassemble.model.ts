import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IQmsReworkDisassemble from '../../interfaces/qms/rework-disassemble.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdLocation from '../std/location.model';
import StdProd from '../std/prod.model';
import StdStore from '../std/store.model';
import QmsRework from './rework.model';

@Table({
  tableName: 'QMS_REWORK_DISASSEMBLE_TB',
  modelName: 'QmsReworkDisassemble',
  comment: '재작업 분해 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class QmsReworkDisassemble extends Model<IQmsReworkDisassemble> {
  @Column({
    comment: '재작업 분해ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  rework_disassemble_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => QmsRework)
  @Column({
    comment: '재작업ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  rework_id: number;
  
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

  @Column({
    comment: '입고 수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  income_qty: number;

  @Column({
    comment: '반납 수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  return_qty: number;

  @Column({
    comment: '폐기 수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  disposal_qty: number;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '입고 창고ID',
    type: DataType.INTEGER,
  })
  income_store_id: number;

  @ForeignKey(() => StdLocation)
  @Column({
    comment: '입고 위치ID',
    type: DataType.INTEGER,
  })
  income_location_id: number;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '반출대기 창고ID',
    type: DataType.INTEGER,
  })
  return_store_id: number;

  @ForeignKey(() => StdLocation)
  @Column({
    comment: '반출대기 위치ID',
    type: DataType.INTEGER,
  })
  return_location_id: number;

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

  @Unique('qms_rework_disassemble_tb_uuid_un')
  @Column({
    comment: '재작업분해UUID',
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

  @BelongsTo(() => QmsRework, { foreignKey: 'rework_id', targetKey: 'rework_id', onDelete: 'restrict', onUpdate: 'cascade' })
  qmsRework: QmsRework;

  @BelongsTo(() => StdStore, { as: 'incomeStore', foreignKey: 'income_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  incomeStore: StdStore

  @BelongsTo(() => StdLocation, { as: 'incomeLocation', foreignKey: 'income_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  incomeLocation: StdLocation;

  @BelongsTo(() => StdStore, { as: 'returnStore', foreignKey: 'return_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  returnStore: StdStore

  @BelongsTo(() => StdLocation, { as: 'returnLocation', foreignKey: 'return_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  returnLocation: StdLocation;

  // HasMany
  //#endregion
}