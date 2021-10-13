import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IAdmStdOptValue from '../../interfaces/adm/std-opt-value.interface';
import AutUser from '../aut/user.model';
import AdmStdOpt from './std-opt.model';
import AdmStdValue from './std-value.model';

@Table({
  // tableName: 'ADM_STD_OPT_VALUE_TB',
  tableName: 'adm_std_opt_value_tb',
  modelName: 'AdmStdOptValue',
  comment: '관리자 기준정보 옵션 값 설정 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmStdOptValue extends Model<IAdmStdOptValue> {
  @Column({
    comment: '관리자 기준정보 옵션 값ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  std_opt_value_id: number;

  @ForeignKey(() => AdmStdOpt)
  @Column({
    comment: '관리자 기준정보 옵션ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  std_opt_id: number;

  @Column({
    comment: '관리자 기준정보 옵션 값',
    type: DataType.STRING(50),
    allowNull: false,
  })
  value: string;

  @ForeignKey(() => AdmStdValue)
  @Column({
    comment: '관리자 기준정보 값ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  std_value_id: number;

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

  @Unique('adm_std_opt_value_tb_uuid_un')
  @Column({
    comment: '관리자 기준정보 옵션 값UUID',
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

  @BelongsTo(() => AdmStdOpt, { foreignKey: 'std_opt_id', targetKey: 'std_opt_id', onDelete: 'restrict', onUpdate: 'cascade' })
  admStdOpt: AdmStdOpt;

  @BelongsTo(() => AdmStdValue, { foreignKey: 'std_value_id', targetKey: 'std_value_id', onDelete: 'restrict', onUpdate: 'cascade' })
  admStdValue: AdmStdValue;

  // HasMany
  //#endregion
}