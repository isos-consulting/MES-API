import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdEmp from '../../interfaces/std/emp.interface';
import AutUser from '../aut/user.model';
import StdDept from './dept.model';
import StdGrade from './grade.model';

@Table({
  tableName: 'STD_EMP_TB',
  modelName: 'StdEmp',
  comment: '사원 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdEmp extends Model<IStdEmp> {
  @Column({
    comment: '사원ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  emp_id: number;

  @Unique('std_emp_tb_emp_cd_un')
  @Column({
    comment: '사번',
    type: DataType.STRING(20),
    allowNull: false,
  })
  emp_cd: string;

  @Column({
    comment: '사원명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  emp_nm: string;

  @Unique('std_emp_tb_uid_un')
  @ForeignKey(() => AutUser)
  @Column({
    comment: '사용자ID',
    type: DataType.INTEGER,
  })
  uid: number;

  @ForeignKey(() => StdDept)
  @Column({
    comment: '부서ID',
    type: DataType.INTEGER,
  })
  dept_id: number;

  @ForeignKey(() => StdGrade)
  @Column({
    comment: '직급ID',
    type: DataType.INTEGER,
  })
  grade_id: number;

  @Column({
    comment: '생년월일',
    type: DataType.DATEONLY,
  })
  birthday: string;

  @Column({
    comment: '휴대폰번호',
    type: DataType.STRING(13),
  })
  hp: string;

  @Column({
    comment: '우편번호',
    type: DataType.STRING(6),
  })
  post: string;

  @Column({
    comment: '주소',
    type: DataType.STRING(100),
  })
  addr: string;

  @Column({
    comment: '상세주소',
    type: DataType.STRING(250),
  })
  addr_detail: string;

  @Column({
    comment: '입사일자',
    type: DataType.DATEONLY,
  })
  enter_date: string;

  @Column({
    comment: '퇴사일자',
    type: DataType.DATEONLY,
  })
  leave_date: string;

  @Column({
    comment: '작업자 유무',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  worker_fg: boolean;

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

  @Unique('std_emp_tb_uuid_un')
  @Column({
    comment: '사원UUID',
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

  @BelongsTo(() => AutUser, { as: 'autUser', foreignKey: 'uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  autUser: AutUser;

  @BelongsTo(() => StdDept, { foreignKey: 'dept_id', targetKey: 'dept_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdDept: StdDept;

  @BelongsTo(() => StdGrade, { foreignKey: 'grade_id', targetKey: 'grade_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdGrade: StdGrade;

  // HasMany
  //#endregion
}