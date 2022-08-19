import { Sequelize, Table, Column, Model, DataType, CreatedAt, BelongsTo, Unique, UpdatedAt, ForeignKey } from 'sequelize-typescript'
import IStdWorktime from '../../interfaces/std/worktime.interface';
import AutUser from '../aut/user.model';
import StdWorkType from './work-type.model';
import StdWorktimeType from './worktime-type.model';

@Table({
  tableName: 'STD_WORKTIME_TB',
  modelName: 'StdWorktime',
  comment: '근무시간 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdWorktime extends Model<IStdWorktime> {
  @Column({
    comment: '근무시간ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  worktime_id: number;

  @Unique('std_worktime_tb_worktime_cd_un')
  @Column({
    comment: '근무시간 코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  worktime_cd: string;

  @Column({
    comment: '근무시간명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  worktime_nm: string;

  @ForeignKey(() => StdWorkType)
  @Column({
    comment: '근무유형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_type_id: number;

  @ForeignKey(() => StdWorktimeType)
  @Column({
    comment: '근무시간유형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  worktime_type_id: number;

  @Column({
    comment: '사용여부',
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: true,
  })
  use_fg: boolean;

  @Column({
    comment: '휴게시간여부',
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  })
  break_time_fg: boolean;

  @Column({
    comment: '근무시작시간',
    type: DataType.TIME,
    allowNull: false,
  })
  start_time: string;

  @Column({
    comment: '근무종료시간',
    type: DataType.TIME,
    allowNull: false,
  })
  end_time: string;

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

  @BelongsTo(() => StdWorktimeType, { foreignKey: 'worktime_type_id', targetKey: 'worktime_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdWorktimeType: StdWorktimeType;

  @BelongsTo(() => StdWorkType, { foreignKey: 'work_type_id', targetKey: 'work_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdWorkType: StdWorkType;
  
  // HasMany
  //#endregion
}