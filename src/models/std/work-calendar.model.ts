import { Sequelize, Table, Column, Model, DataType, CreatedAt, BelongsTo, Unique, UpdatedAt, ForeignKey } from 'sequelize-typescript'
import IStdWorkCalendar from '../../interfaces/std/work-calendar.interface';
import AutUser from '../aut/user.model';
import StdWorkType from './work-type.model';

@Table({
  tableName: 'STD_WORKCALENDAR_TB',
  modelName: 'StdWorkCalendar',
  comment: '근무달력 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdWorkCalendar extends Model<IStdWorkCalendar> {
  @Column({
    comment: '근무달력ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  workcalendar_id: number;

  @ForeignKey(() => StdWorkType)
  @Column({
    comment: '근무유형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  work_type_id: number;

  @Column({
    comment: '주차',
    type: DataType.INTEGER,
    allowNull: true,
  })
  week_no: number;

  @Unique('std_workcalendar_tb_day_no_un')
  @Column({
    comment: '날짜',
    type: DataType.DATEONLY,
    allowNull: false,
  })
  day_no: string;

  @Column({
    comment: '계획 값',
    type: DataType.INTEGER,
    allowNull: true,
  })
  day_value: number;

  @Column({
    comment: '근무달력 사용여부',
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  workcalendar_fg: boolean;

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

  @Unique('std_workcalendar_tb_uuid_un')
  @Column({
    comment: '근무달력UUID',
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

  @BelongsTo(() => StdWorkType, { foreignKey: 'work_type_id', targetKey: 'work_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdWorkType: StdWorkType;

  // HasMany
  //#endregion
}