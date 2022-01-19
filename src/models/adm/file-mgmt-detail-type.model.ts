import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IAdmFileMgmtDetailType from '../../interfaces/adm/file-mgmt-detail-type.interface';
import AutUser from '../aut/user.model';
import AdmFileMgmtType from './file-mgmt-type.model';

@Table({
  tableName: 'ADM_FILE_MGMT_DETAIL_TYPE_TB',
  modelName: 'AdmFileMgmtDetailType',
  comment: '파일관리 상세유형 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmFileMgmtDetailType extends Model<IAdmFileMgmtDetailType> {
  @Column({
    comment: '파일관리 상세유형ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
		autoIncrement: true,
    autoIncrementIdentity: true,
  })
  file_mgmt_detail_type_id: number;

  @Unique('adm_file_mgmt_detail_type_tb_file_mgmt_detail_type_cd_un')
  @Column({
    comment: '파일관리 상세유형코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  file_mgmt_detail_type_cd: string;

  @Column({
    comment: '파일관리 상세유형명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  file_mgmt_detail_type_nm: string;

  @ForeignKey(() => AdmFileMgmtType)
  @Column({
    comment: '파일관리 유형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  file_mgmt_type_id: number;

  @Column({
    comment: '파일 확장자 목록',
    type: DataType.STRING(250),
  })
  file_extension_types: string;

  @Column({
    comment: '정렬',
    type: DataType.INTEGER,
  })
  sortby: number;
  
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

	@Unique('adm_file_mgmt_detail_type_tb_uuid_un')
  @Column({
    comment: '파일관리 상세유형UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string;

  //#region ✅ Define Association
  // BelongTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  updateUser: AutUser;

  @BelongsTo(() => AdmFileMgmtType, { foreignKey: 'file_mgmt_type_id', targetKey: 'file_mgmt_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  admFileMgmtType: AdmFileMgmtType;

  // HasMany
  //#endregion
}