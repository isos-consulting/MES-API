import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IAdmStdValue from '../../interfaces/adm/std-value.interface';
import AutUser from '../aut/user.model';
import AdmStd from './std.model';

@Table({
  // tableName: 'ADM_STD_VALUE_TB',
  tableName: 'adm_std_value_tb',
  modelName: 'AdmStdValue',
  comment: '관리자 기준정보 값 설정 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmStdValue extends Model<IAdmStdValue> {
  @Column({
    comment: '관리자 기준정보 값ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  std_value_id: number;

  @Unique('adm_std_value_tb_std_id_std_value_cd_un')
  @Column({
    comment: '관리자 기준정보 값 코드',
    type: DataType.STRING(50),
    allowNull: false,
  })
  std_value_cd: string;

  @Column({
    comment: '관리자 기준정보 값',
    type: DataType.STRING(50),
    allowNull: false,
  })
  value: string;

  @Unique('adm_std_value_tb_std_id_std_value_cd_un')
  @ForeignKey(() => AdmStd)
  @Column({
    comment: '관리자 기준정보ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  std_id: number;

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

  @Unique('adm_std_value_tb_uuid_un')
  @Column({
    comment: '관리자 기준정보 값UUID',
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