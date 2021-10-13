import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdRouting from '../../interfaces/std/routing.interface';
import AutUser from '../aut/user.model';
import StdFactory from './factory.model';
import StdProc from './proc.model';
import StdProd from './prod.model';

@Table({
  tableName: 'STD_ROUTING_TB',
  modelName: 'StdRouting',
  comment: '라우팅 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdRouting extends Model<IStdRouting> {
  @Column({
    comment: '라우팅ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  routing_id: number;

  @Unique('std_routing_tb_factory_id_prod_id_proc_id_proc_no_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('std_routing_tb_factory_id_prod_id_proc_id_proc_no_un')
  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @Unique('std_routing_tb_factory_id_prod_id_proc_id_proc_no_un')
  @ForeignKey(() => StdProc)
  @Column({
    comment: '공정ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  proc_id: number;

  @Unique('std_routing_tb_factory_id_prod_id_proc_id_proc_no_un')
  @Column({
    comment: '공정순서',
    type: DataType.INTEGER,
    allowNull: false,
  })
  proc_no: number;

  @Column({
    comment: '자동 실적처리유무',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  auto_work_fg: boolean;

  @Column({
    comment: 'Cycle Time',
    type: DataType.DECIMAL(19, 6),
  })
  cycle_time: number;

  @Column({
    comment: 'UPH',
    type: DataType.DECIMAL(19, 6),
  })
  uph: number;

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

  @Unique('std_routing_tb_uuid_un')
  @Column({
    comment: '라우팅UUID',
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

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => StdProc, { foreignKey: 'proc_id', targetKey: 'proc_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProc: StdProc;

  // HasMany
  //#endregion
}