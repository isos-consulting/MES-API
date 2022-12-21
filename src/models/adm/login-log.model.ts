import { Sequelize, Table, Column, Model, DataType, Unique } from 'sequelize-typescript'
import IAdmLoginLog from '../../interfaces/adm/login-log.interface';

@Table({
  tableName: 'ADM_LOGIN_LOG_TB',
  modelName: 'AdmLoginLog',
  comment: '로그인 로그 정보 테이블',
  timestamps: false,
  underscored: true,
})
export default class AdmLoginLog extends Model<IAdmLoginLog> {
  @Column({
    comment: '로그인 로그 ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
		autoIncrement: true,
    autoIncrementIdentity: true,
  })
  log_id: number;

  @Column({
    comment: '업체 코드',
    type: DataType.STRING(50),
    allowNull: false,
  })
  company_cd: string;

  @Column({
    comment: '사용자 아이디',
    type: DataType.STRING(100),
  })
  id: string;

	@Column({
    comment: '사용자 명',
    type: DataType.STRING(100),
  })
  user_nm: string;

	@Column({
    comment: '상태 코드',
    type: DataType.STRING(20),
  })
  state_cd: string;

	@Column({
    comment: 'ip',
    type: DataType.STRING(50),
  })
  ip_address: string;

	@Column({
    comment: '브라우저',
    type: DataType.STRING(300),
  })
  browser: string;

	@Column({
    comment: 'os',
    type: DataType.STRING(50),
  })
  os: string;

  @Column({
    comment: '로그 생성 일시',
    type: 'timestamp',
    allowNull: false,
    defaultValue: Sequelize.fn('now')
  })
  created_at: string;
  
	@Unique('adm_login_log_tb_uuid_un')
  @Column({
    comment: '로그인 로그 uuid',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string;

  //#region ✅ Define Association

  //#endregion

  //#region hooks

  //#endregion
}