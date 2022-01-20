import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IEqmInspResult from '../../interfaces/eqm/insp-result.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdEquip from '../std/equip.model';
import EqmInspDetail from './insp-detail.model';
import StdEmp from '../std/emp.model';

@Table({
  tableName: 'EQM_INSP_RESULT_TB',
  modelName: 'EqmInspResult',
  comment: '설비검사 성적서 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class EqmInspResult extends Model<IEqmInspResult> {
  @Column({
    comment: '설비검사 성적서ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false
  })
  insp_result_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false
  })
  factory_id: number;

  @Unique('eqm_insp_result_tb_insp_detail_id_reg_date_un')
  @ForeignKey(() => EqmInspDetail)
  @Column({
    comment: '설비검사 기준서 상세ID',
    type: DataType.INTEGER,
    allowNull: false
  })
  insp_detail_id: number;

  @ForeignKey(() => StdEquip)
  @Column({
    comment: '설비ID',
    type: DataType.INTEGER,
    allowNull: false
  })
  equip_id: number;

  @ForeignKey(() => StdEmp)
  @Column({
    comment: '검사자ID',
    type: DataType.INTEGER,
    allowNull: false
  })
  emp_id: number;

  @Unique('eqm_insp_result_tb_insp_detail_id_reg_date_un')
  @Column({
    comment: '등록 일시',
    type:  'timestamp',
    allowNull: false
  })
  reg_date: string;

  @Column({
    comment: '검사 값',
    type: DataType.STRING(25),
    allowNull: false
  })
  insp_value: string;

  @Column({
    comment: '합격여부',
    type: DataType.BOOLEAN,
    allowNull: false
  })
  insp_result_fg: boolean;

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

  @Unique('eqm_insp_result_tb_uuid_un')
  @Column({
    comment: '설비검사 성적서UUID',
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

  @BelongsTo(() => EqmInspDetail, { foreignKey: 'insp_detail_id', targetKey: 'insp_detail_id', onDelete: 'restrict', onUpdate: 'cascade' })
  eqmInspDetail: EqmInspDetail;

  @BelongsTo(() => StdEquip, { foreignKey: 'equip_id', targetKey: 'equip_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEquip: StdEquip;

  @BelongsTo(() => StdEmp, { foreignKey: 'emp_id', targetKey: 'emp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEmp: StdEmp;

  // HasMany
  //#endregion
}