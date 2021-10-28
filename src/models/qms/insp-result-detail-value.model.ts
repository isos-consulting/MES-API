import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IQmsInspResultDetailValue from '../../interfaces/qms/insp-result-detail-value.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import QmsInspResultDetailInfo from './insp-result-detail-info.model';
import QmsInspResult from './insp-result.model';

@Table({
  tableName: 'QMS_INSP_RESULT_DETAIL_VALUE_TB',
  modelName: 'QmsInspResultDetailValue',
  comment: '검사 성적서 상세 값 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class QmsInspResultDetailValue extends Model<IQmsInspResultDetailValue> {
  @Column({
    comment: '검사 성적서 상세 값ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_result_detail_value_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => QmsInspResult)
  @Column({
    comment: '검사 성적서ID',
    type: DataType.INTEGER
  })
  insp_result_id: number;

  @ForeignKey(() => QmsInspResultDetailInfo)
  @Column({
    comment: '검사 성적서 상세ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_result_detail_info_id: number;

  @Column({
    comment: '시료 번호',
    type: DataType.INTEGER,
    allowNull: false,
  })
  sample_no: number;

  @Column({
    comment: '검사 값',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  insp_value: number;

  @Column({
    comment: '검사 성적서 상세 값 합격 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  insp_result_fg: boolean;

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

  @Unique('qms_insp_result_detail_info_tb_uuid_un')
  @Column({
    comment: '검사 성적서 상세 값UUID',
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

  @BelongsTo(() => QmsInspResult, { foreignKey: 'insp_result_id', targetKey: 'insp_result_id', onDelete: 'restrict', onUpdate: 'cascade' })
  qmsInspResult: QmsInspResult;

  @BelongsTo(() => QmsInspResultDetailInfo, { foreignKey: 'insp_result_detail_info_id', targetKey: 'insp_result_detail_info_id', onDelete: 'restrict', onUpdate: 'cascade' })
  qmsInspResultDetailInfo: QmsInspResultDetailInfo;

  // HasMany
  //#endregion
}