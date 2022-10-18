import { Sequelize, Table, Column, Model, DataType, Unique, CreatedAt } from 'sequelize-typescript'
import IAdmUseLog from '../../interfaces/adm/use-log.interface';

@Table({
  tableName: 'ADM_USE_LOG_TB',
  modelName: 'AdmUseLog',
  comment: '사용 로그 정보 테이블',
  timestamps: false,
  underscored: true,
})
export default class AdmUseLog extends Model<IAdmUseLog> {
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
    type: DataType.STRING(20),
    allowNull: false,
  })
  company_cd: string;

	@Column({
    comment: '로그 정보',
    type: DataType.STRING(1000),
  })
  log_info: string;

	@Column({
    comment: '로그 tag',
    type: DataType.STRING(1000),
  })
  log_tag: string;

  @Column({
    comment: '사용자 아이디',
    type: DataType.STRING(30),
  })
  id: string;

	@Column({
    comment: '사용자 명',
    type: DataType.STRING(40),
  })
  user_nm: string;

	@Column({
    comment: 'log caption',
    type: DataType.STRING(200),
  })
  log_caption: string;

	@Column({
    comment: 'log action',
    type: DataType.STRING(100),
  })
  log_action: string;

	@Column({
    comment: 'ip 주소',
    type: DataType.STRING(15),
  })
  ip_address: string;

	@Column({
    comment: 'browser',
    type: DataType.STRING(20),
  })
  browser: string;

	@Column({
    comment: 'os',
    type: DataType.STRING(50),
  })
  os: string;

  @CreatedAt
  @Column({
    comment: '데이터 생성 일시',
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('now')
  })
  created_at: Date;
  
	@Unique('adm_use_log_tb_uuid_un')
  @Column({
    comment: '사용 로그 uuid',
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