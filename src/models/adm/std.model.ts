import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IAdmStd from '../../interfaces/adm/std.interface';
import AutUser from '../aut/user.model';

@Table({
  // tableName: 'ADM_STD_TB',
  tableName: 'adm_std_tb',
  modelName: 'AdmStd',
  comment: '관리자 기준정보 설정 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmStd extends Model<IAdmStd> {
  @Column({
    comment: '관리자 기준정보ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  std_id: number;

  @Unique('adm_std_tb_std_cd_un')
  @Column({
    comment: '관리자 기준정보코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  std_cd: string;

  @Column({
    comment: '관리자 기준정보명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  std_nm: string;

  @Column({
    comment: '관리자 기준정보 View 명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  view_nm: string;

  @Column({
    comment: '관리자 기준정보 기준 Column 명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  col_nm: string;

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
  })
  updated_uid: number;

  @Unique('adm_std_tb_uuid_un')
  @Column({
    comment: '관리자 기준정보UUID',
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

  // HasMany
  //#endregion
}