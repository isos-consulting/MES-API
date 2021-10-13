import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IQmsInspDetail from '../../interfaces/qms/insp-detail.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdInspItem from '../std/insp-item.model';
import StdInspMethod from '../std/insp-method.model';
import StdInspTool from '../std/insp-tool.model';
import QmsInsp from './insp.model';

@Table({
  tableName: 'QMS_INSP_DETAIL_TB',
  modelName: 'QmsInspDetail',
  comment: '검사 기준서 상세 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class QmsInspDetail extends Model<IQmsInspDetail> {
  @Column({
    comment: '검사 기준서 상세ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_detail_id: number;

  @Unique('qms_insp_detail_tb_insp_id_seq_un')
  @ForeignKey(() => QmsInsp)
  @Column({
    comment: '검사 기준서ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_id: number;

  @Unique('qms_insp_detail_tb_insp_id_seq_un')
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
    comment: '검사 기준',
    type: DataType.STRING(250),
    allowNull: false,
  })
  spec_std: string;

  @Column({
    comment: '최소 값',
    type: DataType.DECIMAL(19, 6),
  })
  spec_min: number;

  @Column({
    comment: '최대 값',
    type: DataType.DECIMAL(19, 6),
  })
  spec_max: number;

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
    comment: '정렬',
    type: DataType.INTEGER,
  })
  sortby: number;

  @Column({
    comment: '위치번호',
    type: DataType.INTEGER,
  })
  position_no: number;

  @Column({
    comment: '특별특성',
    type: DataType.STRING(10),
  })
  special_property: string;

  @Column({
    comment: '시료 수량(작업자)',
    type: DataType.INTEGER,
  })
  worker_sample_cnt: number;

  @Column({
    comment: '검사 주기(작업자)',
    type: DataType.STRING(250),
  })
  worker_insp_cycle: string;

  @Column({
    comment: '시료 수량(검사원)',
    type: DataType.INTEGER,
  })
  inspector_sample_cnt: number;

  @Column({
    comment: '검사 주기(검사원)',
    type: DataType.STRING(250),
  })
  inspector_insp_cycle: string;

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

  @Unique('qms_insp_detail_tb_uuid_un')
  @Column({
    comment: '검사 기준서 상세UUID',
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

  @BelongsTo(() => QmsInsp, { foreignKey: 'insp_id', targetKey: 'insp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  qmsInsp: QmsInsp;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdInspItem, { foreignKey: 'insp_item_id', targetKey: 'insp_item_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdInspItem: StdInspItem;

  @BelongsTo(() => StdInspTool, { foreignKey: 'insp_tool_id', targetKey: 'insp_tool_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdInspTool: StdInspTool;

  @BelongsTo(() => StdInspMethod, { foreignKey: 'insp_method_id', targetKey: 'insp_method_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdInspMethod: StdInspMethod;

  // HasMany
  //#endregion
}