import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IEqmRepairHistory from '../../interfaces/eqm/repair-history.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdEmp from '../std/emp.model';
import StdEquip from '../std/equip.model';

@Table({
  tableName: 'EQM_REPAIR_HISTORY_TB',
  modelName: 'EqmRepairHistory',
  comment: '설비 수리이력 관리 테이블',
  timestamps: true,
  underscored: true,
})
export default class EqmRepairHistory extends Model<IEqmRepairHistory> {
  @Column({
    comment: '설비 수리이력ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  repair_history_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

	@ForeignKey(() => StdEquip)
  @Column({ 
    comment: '설비ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  equip_id: number;

  @Column({
    comment: '발생시작일시',
    type: DataType.DATE,
    allowNull: false
  })
  occur_start_date: Date;

  @Column({
    comment: '발생종료일시',
    type: DataType.DATE
  })
  occur_end_date: Date;

  @ForeignKey(() => StdEmp)
  @Column({
    comment: '발생확인자ID',
    type: DataType.INTEGER,
  })
  occur_emp_id: number;

  @Column({
    comment: '발생원인',
    type: DataType.STRING(250),
  })
  occur_reason: string;

  @Column({
    comment: '발생내용',
    type: DataType.STRING(250),
  })
  occur_contents: string;

  @Column({
    comment: '수리시작일시',
    type: DataType.DATE
  })
  repair_start_date: Date;

  @Column({
    comment: '수리종료일시',
    type: DataType.DATE
  })
  repair_end_date: Date;

  @Column({
    comment: '수리시간',
    type: DataType.DECIMAL(19, 6)
  })
  repair_time: number;
  
  @Column({
    comment: '수리장소',
    type: DataType.STRING(50),
  })
  repair_place: string;

  @Column({
    comment: '수리금액',
    type: DataType.DECIMAL(19, 6)
  })
  repair_price: number;

	@Column({
    comment: '점검일시',
    type: DataType.DATE,
  })
  check_date: Date;

	@ForeignKey(() => StdEmp)
  @Column({
    comment: '점검자ID',
    type: DataType.INTEGER,
  })
  check_emp_id: number;

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

  @Unique('eqm_repair_history_uuid_un')
  @Column({
    comment: '설비 수리이력UUID',
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
	@BelongsTo(() => StdEmp, { as: 'checkEmp', foreignKey: 'check_emp_id', targetKey: 'emp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  checkEmp: StdEmp;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

	@BelongsTo(() => StdEquip, { foreignKey: 'equip_id', targetKey: 'equip_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEquip: StdEquip;
	
  // HasMany
  //#endregion
}