import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdWorker from '../../interfaces/std/worker.interface';
import AutUser from '../aut/user.model';
import StdEmp from './emp.model';
import StdFactory from './factory.model';
import StdProc from './proc.model';
import StdWorkings from './workings.model';

@Table({
  tableName: 'STD_WORKER_TB',
  modelName: 'StdWorker',
  comment: '작업자 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdWorker extends Model<IStdWorker> {
  @Column({
    comment: '작업자ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  worker_id: number;

  @Unique('std_worker_tb_factory_id_emp_id_un')
  @Unique('std_worker_tb_factory_id_worker_cd_un')
  @Unique('std_worker_tb_factory_id_worker_nm_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => StdProc)
  @Column({
    comment: '공정ID',
    type: DataType.INTEGER,
  })
  proc_id: number;

  @ForeignKey(() => StdWorkings)
  @Column({
    comment: '작업장ID',
    type: DataType.INTEGER,
  })
  workings_id: number;

  @Unique('std_worker_tb_factory_id_emp_id_un')
  @ForeignKey(() => StdEmp)
  @Column({
    comment: '사원ID',
    type: DataType.INTEGER,
  })
  emp_id: number;

  @Unique('std_worker_tb_factory_id_worker_cd_un')
  @Column({
    comment: '작업자코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  worker_cd: string;

  @Unique('std_worker_tb_factory_id_worker_nm_un')
  @Column({
    comment: '작업자명',
    type: DataType.STRING(20),
    allowNull: false,
  })
  worker_nm: string;

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

  @Unique('std_worker_tb_uuid_un')
  @Column({
    comment: '작업자UUID',
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

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdProc, { foreignKey: 'proc_id', targetKey: 'proc_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProc: StdProc;

  @BelongsTo(() => StdWorkings, { foreignKey: 'workings_id', targetKey: 'workings_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdWorkings: StdWorkings;

  @BelongsTo(() => StdEmp, { foreignKey: 'emp_id', targetKey: 'emp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEmp: StdEmp;

  // HasMany
  //#endregion
}