import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdEquip from '../../interfaces/std/equip.interface';
import AutUser from '../aut/user.model';
import StdEmp from './emp.model';
import StdEquipType from './equip-type.model';
import StdFactory from './factory.model';
import StdWorkings from './workings.model';

@Table({
  tableName: 'STD_EQUIP_TB',
  modelName: 'StdEquip',
  comment: '설비 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdEquip extends Model<IStdEquip> {
  @Column({
    comment: '설비ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  equip_id: number;

  @Unique('std_equip_tb_factory_id_equip_cd_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => StdEquipType)
  @Column({
    comment: '설비유형ID',
    type: DataType.INTEGER,
  })
  equip_type_id: number;

  @Unique('std_equip_tb_factory_id_equip_cd_un')
  @Column({
    comment: '설비코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  equip_cd: string;

  @Column({
    comment: '설비명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  equip_nm: string;

  @ForeignKey(() => StdWorkings)
  @Column({
    comment: '작업장ID',
    type: DataType.INTEGER,
  })
  workings_id: number;

  @ForeignKey(() => StdEmp)
  @Column({
    comment: '관리자(정)ID',
    type: DataType.INTEGER,
  })
  manager_emp_id: number;

  @ForeignKey(() => StdEmp)
  @Column({
    comment: '관리자(부)ID',
    type: DataType.INTEGER,
  })
  sub_manager_emp_id: number;
  
  @Column({
    comment: '설비관리번호',
    type: DataType.STRING(25),
  })
  equip_no: string;
  
  @Column({
    comment: '설비등급',
    type: DataType.STRING(10),
  })
  equip_grade: string;
  
  @Column({
    comment: '설비모델명',
    type: DataType.STRING(50),
  })
  equip_model: string;
  
	@Column({
    comment: '설비규격',
    type: DataType.STRING(50),
  })
  equip_std: string;
  
	@Column({
    comment: '설비제원',
    type: DataType.STRING(50),
  })
  equip_spec: string;

  @Column({
    comment: '전압',
    type: DataType.STRING(10),
  })
  voltage: string;

	@Column({
    comment: '제조사',
    type: DataType.STRING(50),
  })
  manufacturer: string;

	@Column({
    comment: '구매업체',
    type: DataType.STRING(50),
  })
  purchase_partner: string;

	@Column({
    comment: '구매일자',
    type: DataType.DATEONLY,
  })
  purchase_date: string;

	@Column({
    comment: '구매업체 연락처',
    type: DataType.STRING(50),
  })
  purchase_tel: string;

	@Column({
    comment: '구매금액',
    type: DataType.DECIMAL(19, 6),
  })
  purchase_price: number;
  
  @Column({
    comment: '사용여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  use_fg: boolean;

  @Column({
    comment: '생산설비여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  prd_fg: boolean;

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

  @Unique('std_equip_tb_uuid_un')
  @Column({
    comment: '설비UUID',
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

  @BelongsTo(() => StdEquipType, { foreignKey: 'equip_type_id', targetKey: 'equip_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEquipType: StdEquipType;

  @BelongsTo(() => StdWorkings, { foreignKey: 'workings_id', targetKey: 'workings_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdWorkings: StdWorkings;

  @BelongsTo(() => StdEmp, { as: 'managerEmp', foreignKey: 'manager_emp_id', targetKey: 'emp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  managerEmp: StdEmp;

  @BelongsTo(() => StdEmp, { as: 'subManagerEmp', foreignKey: 'sub_manager_emp_id', targetKey: 'emp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  subManagerEmp: StdEmp;

  // HasMany
  //#endregion
}