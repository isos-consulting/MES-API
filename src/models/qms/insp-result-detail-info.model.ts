import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IQmsInspResultDetailInfo from '../../interfaces/qms/insp-result-detail-info.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import QmsInspDetail from './insp-detail.model';
import QmsInspResult from './insp-result.model';

@Table({
  tableName: 'QMS_INSP_RESULT_DETAIL_INFO_TB',
  modelName: 'QmsInspResultDetailInfo',
  comment: '검사 성적서 상세 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class QmsInspResultDetailInfo extends Model<IQmsInspResultDetailInfo> {
  @Column({
    comment: '검사 성적서 상세ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_result_detail_info_id: number;

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
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_result_id: number;

  @ForeignKey(() => QmsInspDetail)
  @Column({
    comment: '검사 기준서 상세ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_detail_id: number;

  @Column({
    comment: '검사 성적서 상세 합격 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  insp_result_fg: boolean;

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

  @Unique('qms_insp_result_detail_info_tb_uuid_un')
  @Column({
    comment: '검사 성적서 상세UUID',
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

  @BelongsTo(() => QmsInspDetail, { foreignKey: 'insp_detail_id', targetKey: 'insp_detail_id', onDelete: 'restrict', onUpdate: 'cascade' })
  qmsInspDetail: QmsInspDetail;

  // HasMany
  //#endregion
}