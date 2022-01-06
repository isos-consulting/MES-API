import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdDowntime from '../../interfaces/std/downtime.interface';
import AutUser from '../aut/user.model';
import StdDowntimeType from './downtime-type.model';
import StdFactory from './factory.model';

@Table({
  tableName: 'STD_DOWNTIME_TB',
  modelName: 'StdDowntime',
  comment: '비가동 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdDowntime extends Model<IStdDowntime> {
  @Column({
    comment: '비가동ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  downtime_id: number;

  @Unique('std_downtime_tb_factory_id_downtime_cd_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => StdDowntimeType)
  @Column({
    comment: '비가동 유형ID',
    type: DataType.INTEGER,
  })
  downtime_type_id: number;

  @Unique('std_downtime_tb_factory_id_downtime_cd_un')
  @Column({
    comment: '비가동코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  downtime_cd: string;

  @Column({
    comment: '비가동명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  downtime_nm: string;

  @Column({
    comment: '설비고장여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  eqm_failure_fg: boolean;

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

  @Unique('std_downtime_tb_uuid_un')
  @Column({
    comment: '비가동UUID',
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

  @BelongsTo(() => StdDowntimeType, { foreignKey: 'downtime_type_id', targetKey: 'downtime_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdDowntimeType: StdDowntimeType;

  // HasMany
  //#endregion
}