import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IAdmStdOpt from '../../interfaces/adm/std-opt.interface';
import AutUser from '../aut/user.model';
import AdmStd from './std.model';

@Table({
  // tableName: 'ADM_STD_OPT_TB',
  tableName: 'adm_std_opt_tb',
  modelName: 'AdmStdOpt',
  comment: '관리자 기준정보 옵션 옵션 설정 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmStdOpt extends Model<IAdmStdOpt> {
  @Column({
    comment: '관리자 기준정보 옵션ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  std_opt_id: number;

  @Unique('adm_std_opt_tb_std_id_std_opt_cd_un')
  @Column({
    comment: '관리자 기준정보 옵션코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  std_opt_cd: string;

  @Column({
    comment: '관리자 기준정보 옵션명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  std_opt_nm: string;

  @Unique('adm_std_opt_tb_std_id_std_opt_cd_un')
  @ForeignKey(() => AdmStd)
  @Column({
    comment: '관리자 기준정보ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  std_id: number;

  @Column({
    comment: '옵션 Column 사용 유무',
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  col_use_fg: string;

  @Column({
    comment: '옵션 Column DataType 구분',
    type: DataType.STRING(20),
    allowNull: false,
  })
  col_gb: string;

  @Column({
    comment: '옵션 Column Alias(별칭)',
    type: DataType.STRING(20),
    allowNull: false,
  })
  alias: string;

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

  @Unique('adm_std_opt_tb_uuid_un')
  @Column({
    comment: '관리자 기준정보 옵션UUID',
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

  @BelongsTo(() => AdmStd, { foreignKey: 'std_id', targetKey: 'std_id', onDelete: 'restrict', onUpdate: 'cascade' })
  admStd: AdmStd;

  // HasMany
  //#endregion
}