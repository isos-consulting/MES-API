import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IAdmFileMgmt from '../../interfaces/adm/file-mgmt.interface';
import AutUser from '../aut/user.model';
import AdmFileMgmtDetailType from './file-mgmt-detail-type.model';

@Table({
  tableName: 'ADM_FILE_MGMT_TB',
  modelName: 'AdmFileMgmt',
  comment: '파일관리 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmFileMgmt extends Model<IAdmFileMgmt> {
  @Column({
    comment: '파일관리ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  file_mgmt_id: number;

  @ForeignKey(() => AdmFileMgmtDetailType)
  @Column({
    comment: '파일관리 상세유형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  file_mgmt_detail_type_id: number;

  @Column({
    comment: '파일관련 테이블 Row UUID',
    type: DataType.UUID,
    allowNull: false,
  })
  reference_uuid: string

  @Column({
    comment: '파일명',
    type: DataType.STRING(250),
    allowNull: false,
  })
  file_nm: string;

  @Column({
    comment: '파일확장자',
    type: DataType.STRING(20),
    allowNull: false,
  })
  file_extension: string;

  @Column({
    comment: '파일 용량(KB)',
    type: DataType.BIGINT,
    allowNull: false,
  })
  file_size: number;

  @Column({
    comment: 'IP Address',
    type: DataType.STRING(39),
  })
  ip: string;

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

  @Unique('adm_file_mgmt_tb_uuid_un')
  @Column({
    comment: '파일관리UUID',
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
  
  @BelongsTo(() => AdmFileMgmtDetailType, { foreignKey: 'file_mgmt_detail_type_id', targetKey: 'file_mgmt_detail_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  admFileMgmtDetailType: AdmFileMgmtDetailType;

  // HasMany
  //#endregion
}