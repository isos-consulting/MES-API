import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdRoutingResource from '../../interfaces/std/routing-resource.interface';
import AutUser from '../aut/user.model';
import StdEquip from './equip.model';
import StdFactory from './factory.model';
import StdRouting from './routing.model';

@Table({
  tableName: 'STD_ROUTING_RESOURCE_TB',
  modelName: 'StdRoutingResource',
  comment: '생산자원 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdRoutingResource extends Model<IStdRoutingResource> {
  @Column({
    comment: '생산자원ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  routing_resource_id: number;

  @Unique('std_routing_resource_tb_factory_id_routing_id_resource_type_equip_id_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('std_routing_resource_tb_factory_id_routing_id_resource_type_equip_id_un')
  @ForeignKey(() => StdRouting)
  @Column({
    comment: '라우팅ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  routing_id: number;

  @Unique('std_routing_resource_tb_factory_id_routing_id_resource_type_equip_id_un')
  @Column({
    comment: '자원 유형(사람 OR 설비)',
    type: DataType.STRING(10),
    allowNull: false,
  })
  resource_type: string;

  @Unique('std_routing_resource_tb_factory_id_routing_id_resource_type_equip_id_un')
  @ForeignKey(() => StdEquip)
  @Column({
    comment: '설비ID (자원이 설비일 경우)',
    type: DataType.INTEGER,
  })
  equip_id: number;

  @Column({
    comment: '인원 (자원이 사람일 경우)',
    type: DataType.INTEGER,
  })
  emp_cnt: number;

  @Column({
    comment: 'Cycle Time',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
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

  @Unique('std_routing_resource_tb_uuid_un')
  @Column({
    comment: '생산자원UUID',
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

  @BelongsTo(() => StdRouting, { foreignKey: 'routing_id', targetKey: 'routing_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdRouting: StdRouting;

  @BelongsTo(() => StdEquip, { foreignKey: 'equip_id', targetKey: 'equip_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEquip: StdEquip;

  // HasMany
  //#endregion
}