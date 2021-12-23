import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IAdmCompanyOpt from '../../interfaces/adm/company-opt.interface';
import AutUser from '../aut/user.model';

@Table({
  // tableName: 'ADM_COMPANY_OPT_TB',
  tableName: 'ADM_COMPANY_OPT_VW',
  modelName: 'AdmCompanyOpt',
  comment: '회사 옵션 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmCompanyOpt extends Model<IAdmCompanyOpt> {
  @Column({
    comment: '회사 옵션정보ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
		autoIncrement: true,
    autoIncrementIdentity: true,
  })
  company_opt_id: number;

  @Unique('adm_company_opt_tb_company_opt_cd_un')
  @Column({
    comment: '회사 옵션정보코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  company_opt_cd: string;

  @Column({
    comment: '회사 옵션정보명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  company_opt_nm: string;

  @Column({
    comment: '옵션 값',
    type: DataType.STRING(50),
  })
  val: string;

  @Column({
    comment: '옵션 값(추가)',
    type: DataType.STRING(50),
  })
  val_opt: string;

  @Column({
    comment: '비고',
    type: DataType.STRING(250),
  })
  remark: string;

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

	@Unique('adm_company_opt_tb_uuid_un')
  @Column({
    comment: '회사 옵션UUID',
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