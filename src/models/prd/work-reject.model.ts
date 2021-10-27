import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IPrdWorkReject from '../../interfaces/prd/work-reject.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdLocation from '../std/location.model';
import PrdWorkRouting from '../prd/work-routing.model'
import StdReject from '../std/reject.model';
import StdStore from '../std/store.model';
import PrdWork from './work.model';

@Table({
  tableName: 'PRD_WORK_REJECT_TB',
  modelName: 'PrdWorkReject',
  comment: '생산 부적합 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class PrdWorkReject extends Model<IPrdWorkReject> {
  @Column({
    comment: '생산 부적합ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_reject_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('prd_work_reject_tb_work_id_reject_id_un')
  @ForeignKey(() => PrdWork)
  @Column({
    comment: '실적ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_id: number;

  @ForeignKey(() => PrdWorkRouting)
  @Column({
    comment: '공정순서ID',
    type: DataType.INTEGER,
  })
  work_routing_id: number;

  @Unique('prd_work_reject_tb_work_id_reject_id_un')
  @ForeignKey(() => StdReject)
  @Column({
    comment: '부적합ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  reject_id: number;

  @Column({
    comment: '수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  qty: number;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '입고 창고ID',
    type: DataType.INTEGER,
    allowNull: false,
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

  @Unique('prd_work_reject_tb_uuid_un')
  @Column({
    comment: '생산 부적합UUID',
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
  
  @BelongsTo(() => PrdWork, { foreignKey: 'work_id', targetKey: 'work_id', onDelete: 'restrict', onUpdate: 'cascade' })
  prdWork: PrdWork;
  
  @BelongsTo(() => PrdWorkRouting, { foreignKey: 'work_routing_id', targetKey: 'work_routing_id', onDelete: 'restrict', onUpdate: 'cascade' })
  prdWorkRouting: PrdWorkRouting;

  @BelongsTo(() => StdReject, { foreignKey: 'reject_id', targetKey: 'reject_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdReject: StdReject;

  @BelongsTo(() => StdStore, { foreignKey: 'to_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdStore: StdStore;

  @BelongsTo(() => StdLocation, { foreignKey: 'to_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdLocation: StdLocation;

  // HasMany
  //#endregion
}