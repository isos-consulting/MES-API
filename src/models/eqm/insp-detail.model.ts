import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IEqmInspDetail from '../../interfaces/eqm/insp-detail.interface';
import AdmCycleUnit from '../adm/cycle-unit.model';
import AdmDailyInspCycle from '../adm/daily-insp-cycle.model';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdInspItem from '../std/insp-item.model';
import StdInspMethod from '../std/insp-method.model';
import StdInspTool from '../std/insp-tool.model';
import EqmInsp from './insp.model';

@Table({
  tableName: 'EQM_INSP_DETAIL_TB',
  modelName: 'EqmInspDetail',
  comment: '설비검사 기준서 상세 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class EqmInspDetail extends Model<IEqmInspDetail> {
  @Column({
    comment: '설비검사 기준서 상세ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_detail_id: number;

  @Unique('eqm_insp_detail_tb_insp_id_seq_un')
  @ForeignKey(() => EqmInsp)
  @Column({
    comment: '설비검사 기준서ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_id: number;

  @Unique('eqm_insp_detail_tb_insp_id_seq_un')
  @Column({
    comment: '기준서 순번',
    type: DataType.INTEGER,
    allowNull: false,
  })
  seq: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => StdInspItem)
  @Column({
    comment: '검사항목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_item_id: number;

  @Column({
    comment: '검사항목 상세내용',
    type: DataType.STRING(250),
  })
  insp_item_desc: string;

  @Column({
    comment: '정기점검 여부 (일상점검: false, 정기점검: true)',
    type: DataType.BOOLEAN,
    allowNull: false
  })
  periodicity_fg: boolean;

  @Column({
    comment: '검사 기준',
    type: DataType.STRING(250),
    allowNull: false,
  })
  spec_std: string;

  @Column({
    comment: '최소 값',
    type: DataType.STRING(25),
  })
  spec_min: string;

  @Column({
    comment: '최대 값',
    type: DataType.STRING(25),
  })
  spec_max: string;

  @ForeignKey(() => StdInspTool)
  @Column({
    comment: '검사구ID',
    type: DataType.INTEGER,
  })
  insp_tool_id: number;

  @ForeignKey(() => StdInspMethod)
  @Column({
    comment: '검사 방법ID',
    type: DataType.INTEGER,
  })
  insp_method_id: number;

  @Column({
    comment: '주기 기준일',
    type: DataType.DATEONLY,
  })
  base_date: string;

  @ForeignKey(() => AdmDailyInspCycle)
  @Column({
    comment: '일상점검주기ID',
    type: DataType.INTEGER
  })
  daily_insp_cycle_id: number;

  @ForeignKey(() => AdmCycleUnit)
  @Column({
    comment: '주기단위ID (정기점검에서 사용)',
    type: DataType.INTEGER
  })
  cycle_unit_id: number;

  @Column({
    comment: '점검주기 (정기점검에서 사용)',
    type: DataType.INTEGER
  })
  cycle: number;

  @Column({
    comment: '정렬',
    type: DataType.INTEGER,
  })
  sortby: number;

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

  @Unique('eqm_insp_detail_tb_uuid_un')
  @Column({
    comment: '설비검사 기준서 상세UUID',
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

  @BelongsTo(() => EqmInsp, { foreignKey: 'insp_id', targetKey: 'insp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  eqmInsp: EqmInsp;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdInspItem, { foreignKey: 'insp_item_id', targetKey: 'insp_item_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdInspItem: StdInspItem;

  @BelongsTo(() => StdInspTool, { foreignKey: 'insp_tool_id', targetKey: 'insp_tool_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdInspTool: StdInspTool;

  @BelongsTo(() => StdInspMethod, { foreignKey: 'insp_method_id', targetKey: 'insp_method_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdInspMethod: StdInspMethod;

  @BelongsTo(() => AdmDailyInspCycle, { foreignKey: 'daily_insp_cycle_id', targetKey: 'daily_insp_cycle_id', onDelete: 'restrict', onUpdate: 'cascade' })
  admDailyInspCycle: AdmDailyInspCycle;

  @BelongsTo(() => AdmCycleUnit, { foreignKey: 'cycle_unit_id', targetKey: 'cycle_unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  admCycleUnit: AdmCycleUnit;

  // HasMany
  //#endregion
}