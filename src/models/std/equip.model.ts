import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdEquip from '../../interfaces/std/equip.interface';
import AutUser from '../aut/user.model';
import StdEquipType from './equip-type.model';
import StdFactory from './factory.model';

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

  @Column({
    comment: '사용여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  use_fg: string;

  @Column({
    comment: '생산설비여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  prd_fg: string;

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

  // HasMany
  //#endregion
}