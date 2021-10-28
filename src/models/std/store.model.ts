import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdStore from '../../interfaces/std/store.interface';
import AutUser from '../aut/user.model';
import StdFactory from './factory.model';

@Table({
  tableName: 'STD_STORE_TB',
  modelName: 'StdStore',
  comment: '창고 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdStore extends Model<IStdStore> {
  @Column({
    comment: '창고ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  store_id: number;

  @Unique('std_store_tb_factory_id_store_cd_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('std_store_tb_factory_id_store_cd_un')
  @Column({
    comment: '창고코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  store_cd: string;

  @Column({
    comment: '창고명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  store_nm: string;

  @Column({
    comment: '부적합 창고 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  reject_store_fg: boolean;

  @Column({
    comment: '반출 창고 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  return_store_fg: boolean;

  @Column({
    comment: '출하 창고 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  outgo_store_fg: boolean;

  @Column({
    comment: '최종검사 창고 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  final_insp_store_fg: boolean;

  @Column({
    comment: '외주 창고 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  outsourcing_store_fg: boolean;

  @Column({
    comment: '가용재고 창고 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  available_store_fg: boolean;

  @Column({
    comment: '창고 위치 유형(사내/사외)',
    type: DataType.STRING(10),
  })
  position_type: string;

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

  @Unique('std_store_tb_uuid_un')
  @Column({
    comment: '창고UUID',
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

  // HasMany
  //#endregion
}