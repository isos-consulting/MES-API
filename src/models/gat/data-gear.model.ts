import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdDataGear from '../../interfaces/gat/data-gear.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';


@Table({
  tableName: 'STD_DATA_GEAR_TB',
  modelName: 'StdDataGear',
  comment: '인터페이스 장비 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdDataGear extends Model<IStdDataGear> {
  @Column({
    comment: '인터페이스 장비 ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  data_gear_id: number;

	@Unique('std_data_gear_tb_factory_id_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Column({
    comment: '인터페이스 장비코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  data_gear_cd: string;

  @Column({
    comment: '안터페이스 장비명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  data_gear_nm: string;

	@Column({
    comment: '장비 ip',
    type: DataType.STRING(15),
  })
  ip: string;

	@Column({
    comment: '장비 port',
    type: DataType.STRING(5),
  })
  port: string;

	@Column({
    comment: '장비 type',
    type: DataType.STRING(20),
  })
  gear_type: string;

	@Column({
    comment: '연결 type',
    type: DataType.STRING(20),
  })
  connection_type: string;

	@Column({
    comment: '제조사',
    type: DataType.STRING,
  })
  manufacturer: string;

	@Column({
    comment: '프로토콜',
    type: DataType.STRING,
  })
  protocol: string;

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

  @Unique('std_data_gear_tb_uuid_un')
  @Column({
    comment: '인터페이스 장비UUID',
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