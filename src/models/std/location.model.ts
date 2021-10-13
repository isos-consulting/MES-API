import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdLocation from '../../interfaces/std/location.interface';
import AutUser from '../aut/user.model';
import StdFactory from './factory.model';
import StdStore from './store.model';

@Table({
  tableName: 'STD_LOCATION_TB',
  modelName: 'StdLocation',
  comment: '위치 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdLocation extends Model<IStdLocation> {
  @Column({
    comment: '위치ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  location_id: number;

  @Unique('std_location_tb_factory_id_location_cd_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '창고ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  store_id: number;

  @Unique('std_location_tb_factory_id_location_cd_un')
  @Column({
    comment: '위치코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  location_cd: string;

  @Column({
    comment: '위치명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  location_nm: string;

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

  @Unique('std_location_tb_uuid_un')
  @Column({
    comment: '위치UUID',
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

  @BelongsTo(() => StdStore, { foreignKey: 'store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdStore: StdStore;

  // HasMany
  //#endregion
}