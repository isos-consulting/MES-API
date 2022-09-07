import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IPrdWorkRouting from '../../interfaces/prd/work-routing.interface';
import AutUser from '../aut/user.model';
import StdEquip from '../std/equip.model';
import StdFactory from '../std/factory.model';
import StdProc from '../std/proc.model';
import StdWorkings from '../std/workings.model';
import PrdWork from './work.model';
import MldMold from '../mld/mold.model';
import PrdWorkRoutingOrigin from './work-routing-origin.model';

@Table({
  tableName: 'PRD_WORK_ROUTING_TB',
  modelName: 'PrdWorkRouting',
  comment: '공정순서 정보(실적) 테이블',
  timestamps: true,
  underscored: true,
})
export default class PrdWorkRouting extends Model<IPrdWorkRouting> {
  @Column({
    comment: '실적 공정순서ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_routing_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => PrdWork)
  @Column({
    comment: '실적ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_id: number;

  @ForeignKey(() => PrdWorkRoutingOrigin)
  @Column({
    comment: '공정순서 정보ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_routing_origin_id: number;

  @ForeignKey(() => StdProc)
  @Column({
    comment: '공정ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  proc_id: number;

  @Column({
    comment: '공정순서',
    type: DataType.INTEGER,
    allowNull: false,
  })
  proc_no: number;

  @ForeignKey(() => StdWorkings)
  @Column({
    comment: '작업장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  workings_id: number;

  @ForeignKey(() => StdEquip)
  @Column({
    comment: '설비ID',
    type: DataType.INTEGER,
  })
  equip_id: number;

  @ForeignKey(() => MldMold)
  @Column({
    comment: '금형ID',
    type: DataType.INTEGER,
  })
  mold_id: number;

  @Column({
    comment: '금형Cavity',
    type: DataType.INTEGER,
  })
  mold_cavity: number;

  @Column({
    comment: '수량',
    type: DataType.DECIMAL(19,6),
  })
  qty: number;

  @Column({
    comment: '시작일시',
    type: 'timestamp',
    defaultValue: Sequelize.fn('now')
  })
  start_date: string;

  @Column({
    comment: '종료일시',
    type: 'timestamp',
  })
  end_date: string;

  @Column({
    comment: '작업시간',
    type: DataType.INTEGER,
  })
  work_time: number;

  @Column({
    comment: '작업중인 공정 여부',
    type: DataType.BOOLEAN,
  })
  ongoing_fg: boolean;

  @Column({
    comment: '생산 카운트 신호 수',
    type: DataType.INTEGER,
  })
  prd_signal_cnt: number;

  @Column({
    comment: '생산 카운트 시작 값',
    type: DataType.DECIMAL(19,6),
  })
  start_signal_val: number;

  @Column({
    comment: '완료 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  complete_fg: boolean;

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

  @Unique('prd_work_routing_tb_uuid_un')
  @Column({
    comment: '실적 공정순서UUID',
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

  @BelongsTo(() => PrdWorkRoutingOrigin, { foreignKey: 'work_routing_origin_id', targetKey: 'work_routing_origin_id', onDelete: 'restrict', onUpdate: 'cascade' })
  prdWorkRoutingOrigin: PrdWorkRoutingOrigin;

  @BelongsTo(() => StdProc, { foreignKey: 'proc_id', targetKey: 'proc_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProc: StdProc;
  
  @BelongsTo(() => StdWorkings, { foreignKey: 'workings_id', targetKey: 'workings_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdWorkings: StdWorkings;

  @BelongsTo(() => StdEquip, { foreignKey: 'equip_id', targetKey: 'equip_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEquip: StdEquip;

  @BelongsTo(() => MldMold, { foreignKey: 'mold_id', targetKey: 'mold_id', onDelete: 'restrict', onUpdate: 'cascade' })
  mldMold: MldMold;
  

  // HasMany
  //#endregion
}