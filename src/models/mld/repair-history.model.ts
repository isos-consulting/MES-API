import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IMldRepairHistory from '../../interfaces/mld/repair-history.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdProd from '../std/prod.model';
import MldMold from '../mld/mold.model';
import MldProblem from '../mld/problem.model';
import StdEmp from '../std/emp.model';

@Table({
  tableName: 'MLD_REPAIR_HISTORY_TB',
  modelName: 'MldRepairHistory',
  comment: '금형 수리이력 관리 테이블',
  timestamps: true,
  underscored: true,
})
export default class MldRepairHistory extends Model<IMldRepairHistory> {
  @Column({
    comment: '금형 수리이력ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  repair_history_id: number;

	@Unique('mld_repair_history_tb_factory_id_mold_id_start_date_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

	@Unique('mld_repair_history_tb_factory_id_mold_id_start_date_un')
	@ForeignKey(() => MldMold)
  @Column({
    comment: '금형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  mold_id: number;

	@ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
  })
  prod_id: number;

	@ForeignKey(() => MldProblem)
  @Column({
    comment: '문제점ID',
    type: DataType.INTEGER,
		allowNull: false,
  })
  problem_id: number;

	@Column({
    comment: '발생일시',
    type: DataType.DATE,
  })
  occur_date: Date;

	@ForeignKey(() => StdEmp)
  @Column({
    comment: '발생확인자ID',
    type: DataType.INTEGER,
  })
  occur_emp_id: number;

	@ForeignKey(() => StdEmp)
  @Column({
    comment: '수리자ID',
    type: DataType.INTEGER,
  })
  repair_emp_id: number;

  @Column({
    comment: '수리업체',
    type: DataType.STRING(50),
  })
  repair_partner: string;

	@Column({
    comment: '수리번호',
    type: DataType.STRING(50),
  })
  repair_no: string;

	@Unique('mld_repair_history_tb_factory_id_mold_id_start_date_un')
	@Column({
    comment: '수리 시작일시',
    type: DataType.DATE,
		allowNull: false,
  })
  start_date: Date;

	@Column({
    comment: '수리 완료일시',
    type: DataType.DATE,
  })
  end_date: Date;

	@Column({
    comment: '수리 내용',
    type: DataType.STRING(250),
  })
  contents: string;

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

  @Unique('mld_repair_history_uuid_un')
  @Column({
    comment: '금형 수리이력 관리UUID',
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

	@BelongsTo(() => StdEmp, { as: 'occurEmp', foreignKey: 'occur_emp_id', targetKey: 'emp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  occurEmp: StdEmp;
	@BelongsTo(() => StdEmp, { as: 'repairEmp', foreignKey: 'repair_emp_id', targetKey: 'emp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  repairEmp: StdEmp;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

	@BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

	@BelongsTo(() => MldMold, { foreignKey: 'mold_id', targetKey: 'mold_id', onDelete: 'restrict', onUpdate: 'cascade' })
  mldMold: MldMold;

	@BelongsTo(() => MldProblem, { foreignKey: 'problem_id', targetKey: 'problem_id', onDelete: 'restrict', onUpdate: 'cascade' })
  mldProblem: MldProblem;
	
  // HasMany
  //#endregion
}