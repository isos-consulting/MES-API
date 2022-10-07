import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IPrdPlanDaily from '../../interfaces/prd/plan-daily.interface';
import AutUser from '../aut/user.model';
import PrdPlanMonthly from './plan-monthly.model';
import StdFactory from '../std/factory.model';
import StdProd from '../std/prod.model';
import StdWorkings from '../std/workings.model';

@Table({
  tableName: 'PRD_PLAN_DAILY_TB',
  modelName: 'PrdPlanDaily',
  comment: '일별 생산계획 테이블',
  timestamps: true,
  underscored: true,
})
export default class PrdPlanDaily extends Model<IPrdPlanDaily> {
  @Column({
    comment: '일 생산계획ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  plan_daily_id: number;

	@ForeignKey(() => PrdPlanMonthly)
  @Column({
    comment: '월 생산계획ID',
    type: DataType.INTEGER,
  })
  plan_monthly_id: number;

  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => StdWorkings)
  @Column({
    comment: '작업장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  workings_id: number;

  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @Column({
    comment: '일 계획 수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
    defaultValue: 0,
  })
  plan_daily_qty: number;

  @Column({
    comment: '계획 일',
    type: DataType.DATE,
    allowNull: false,
  })
  plan_day: Date;

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

  @Unique('prd_plan_daily_uuid_un')
  @Column({
    comment: '일 생산계획UUID',
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

	@BelongsTo(() => PrdPlanMonthly, { foreignKey: 'plan_monthly_id', targetKey: 'plan_monthly_id', onDelete: 'restrict', onUpdate: 'cascade' })
  prdPlanMonthly: PrdPlanMonthly;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;
  
  @BelongsTo(() => StdWorkings, { foreignKey: 'workings_id', targetKey: 'workings_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdWorkings: StdWorkings;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  // HasMany
  //#endregion
}