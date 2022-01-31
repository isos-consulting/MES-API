import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdProcEquip from '../../interfaces/std/proc-equip.interface';
import AutUser from '../aut/user.model';
import StdEquip from './equip.model';
import StdFactory from './factory.model';
import StdProc from './proc.model';

@Table({
  tableName: 'STD_PROC_EQUIP_TB',
  modelName: 'StdProcEquip',
  comment: '공정별 설비정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdProcEquip extends Model<IStdProcEquip> {
  @Column({
    comment: '공정별 설비정보ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  proc_equip_id: number;

  @Unique('std_proc_equip_tb_factory_id_proc_id_equip_id_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('std_proc_equip_tb_factory_id_proc_id_equip_id_un')
  @ForeignKey(() => StdProc)
  @Column({
    comment: '공정ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  proc_id: number;

  @Unique('std_proc_equip_tb_factory_id_proc_id_equip_id_un')
  @ForeignKey(() => StdEquip)
  @Column({
    comment: '설비ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  equip_id: number;

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

  @Unique('std_proc_equip_tb_uuid_un')
  @Column({
    comment: '공정별 설비정보UUID',
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

  @BelongsTo(() => StdEquip, { foreignKey: 'equip_id', targetKey: 'equip_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEquip: StdEquip;

  // HasMany
  //#endregion
}