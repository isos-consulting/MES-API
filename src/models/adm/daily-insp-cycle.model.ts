import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IAdmDailyInspCycle from '../../interfaces/adm/daily-insp-cycle.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'ADM_DAILY_INSP_CYCLE_TB',
  modelName: 'AdmDailyInspCycle',
  comment: '일상점검주기 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmDailyInspCycle extends Model<IAdmDailyInspCycle> {
  @Column({
    comment: '일상점검주기ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
		autoIncrement: true,
    autoIncrementIdentity: true,
  })
  daily_insp_cycle_id: number;

  @Unique('adm_daily_insp_cycle_tb_daily_insp_cycle_cd_un')
  @Column({
    comment: '일상점검주기코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  daily_insp_cycle_cd: string;

  @Column({
    comment: '일상점검주기명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  daily_insp_cycle_nm: string;

  @Column({
    comment: '정렬',
    type: DataType.INTEGER
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

	@Unique('adm_daily_insp_cycle_tb_uuid_un')
  @Column({
    comment: '일상점검주기UUID',
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