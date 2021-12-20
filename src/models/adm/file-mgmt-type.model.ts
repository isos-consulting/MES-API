import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IAdmFileMgmtType from '../../interfaces/adm/file-mgmt-type.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'ADM_FILE_MGMT_TYPE_TB',
  modelName: 'AdmFileMgmtType',
  comment: '파일 관리 유형 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmFileMgmtType extends Model<IAdmFileMgmtType> {
  @Column({
    comment: '파일 관리 유형ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
		autoIncrement: true,
    autoIncrementIdentity: true,
  })
  file_mgmt_type_id: number;

  @Unique('adm_file_mgmt_type_tb_file_mgmt_type_cd_un')
  @Column({
    comment: '파일 관리 유형코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  file_mgmt_type_cd: string;

  @Column({
    comment: '파일 관리 유형명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  file_mgmt_type_nm: string;

  @Column({
    comment: '테이블명',
    type: DataType.STRING,
  })
  table_nm: string;

  @Column({
    comment: '아이디명',
    type: DataType.STRING,
  })
  id_nm: string;

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

	@Unique('adm_file_mgmt_type_tb_uuid_un')
  @Column({
    comment: '파일 관리 유형UUID',
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

  // HasMany
  //#endregion
}