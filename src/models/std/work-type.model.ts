import { Sequelize, Table, Column, Model, DataType, CreatedAt, BelongsTo, Unique, UpdatedAt } from 'sequelize-typescript'
import IStdWorkType from '../../interfaces/std/work-type.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'STD_WORK_TYPE_TB',
  modelName: 'StdWorkType',
  comment: '근무유형 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdWorkType extends Model<IStdWorkType> {
  @Column({
    comment: '근무유형ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_type_id: number;

  @Unique('std_work_type_tb_work_type_cd_un')
  @Column({
    comment: '근무유형 코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  work_type_cd: string;

  @Column({
    comment: '근무유형명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  work_type_nm: string;

  @Column({
    comment: '사용유무',
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: true,
  })
  use_fg: boolean;

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

  @Unique('std_worktime_type_tb_uuid_un')
  @Column({
    comment: '근무유형UUID',
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