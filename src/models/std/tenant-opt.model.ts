import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IStdTenantOpt from '../../interfaces/std/tenant-opt.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'STD_TENANT_OPT_TB',
  modelName: 'StdTenantOpt',
  comment: '사용자정의옵션 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdTenantOpt extends Model<IStdTenantOpt> {
  @Column({
    comment: '사용자정의옵션ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
		autoIncrement: true,
    autoIncrementIdentity: true,
  })
  tenant_opt_id: number;

  @Unique('std_tenant_opt_tb_tenant_opt_cd_un')
  @Column({
    comment: '사용자정의옵션코드',
    type: DataType.STRING(50),
    allowNull: false,
  })
  tenant_opt_cd: string;

  @Column({
    comment: '사용자정의옵션명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  tenant_opt_nm: string;

  @Column({
    comment: '사용자정의옵션 값',
    type: DataType.INTEGER,
    allowNull: false,
  })
  value: number;

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

	@Unique('std_tenant_opt_tb_uuid_un')
  @Column({
    comment: '사용자정의옵션UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string;

  //#region ✅ Define Association
  // BelongTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', constraints: false })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', constraints: false })
  updateUser: AutUser;

  // HasMany
  //#endregion
}